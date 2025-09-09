// convex/orders.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Shared helper: compute totals + discounts
async function buildOrderFromCart(
  ctx: any,
  userId: string,
  couponCode?: string,
  paymentMethod?: "razorpay" | "cod"
) {
  const cart = await ctx.db
    .query("carts")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
  if (!cart) throw new Error("No active cart found");

  const cartItems = await ctx.db
    .query("cart_items")
    .withIndex("by_cart", (q: any) => q.eq("cartId", cart._id))
    .collect();
  if (cartItems.length === 0) throw new Error("Cart is empty");

  const items = cartItems.map((item: any) => ({
    productId: item.productId,
    name: item.productName,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    price: item.priceSnapshot,
    image: item.productImage,
  }));

  const subtotal = items.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  );

  // coupon logic (unchanged)
  let discount = 0;
  let appliedCoupon: string | undefined = undefined;

  if (couponCode) {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q: any) => q.eq("code", couponCode))
      .first();
    if (coupon && coupon.isActive) {
      const now = Date.now();
      if (
        (!coupon.validFrom || now >= coupon.validFrom) &&
        (!coupon.validTo || now <= coupon.validTo) &&
        (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)
      ) {
        if (coupon.type === "percentage") {
          discount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount)
            discount = Math.min(discount, coupon.maxDiscount);
        } else if (coupon.type === "fixed") {
          discount = coupon.value;
        }
        discount = Math.min(discount, subtotal);
        appliedCoupon = coupon.code;
        // increment used count
        await ctx.db.patch(coupon._id, {
          usedCount: (coupon.usedCount ?? 0) + 1,
        });
      }
    }
  }

  // slab discount: ₹50 per ₹1000 (server-side)
  const slabDiscount = Math.floor(subtotal / 1000) * 50;

  // if paymentMethod is razorpay, apply slab discount in addition to any coupon
  if (paymentMethod === "razorpay" && slabDiscount > 0) {
    discount = Math.min(subtotal, (discount || 0) + slabDiscount);
  }

  const total = Math.max(subtotal - (discount || 0), 0);

  return { cart, cartItems, items, subtotal, discount, total, appliedCoupon };
}

// 1. Start checkout
export const startCheckout = mutation({
  args: {
    authId: v.string(),
    addressId: v.id("addresses"),
    paymentMethod: v.union(v.literal("razorpay"), v.literal("cod")),
    couponCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", args.authId))
      .first();
    if (!user) throw new Error("User not found");

    // pass paymentMethod into the builder so slab discounts are calculated server-side
    const { cart, cartItems, items, subtotal, discount, total, appliedCoupon } =
      await buildOrderFromCart(
        ctx,
        user._id,
        args.couponCode,
        args.paymentMethod
      );

    const orderId = await ctx.db.insert("orders", {
      userId: user._id,
      addressId: args.addressId,
      items,
      subtotal,
      discount,
      total,
      paymentStatus: args.paymentMethod === "cod" ? "cod" : "pending",
      paymentMethod: args.paymentMethod,
      status: "placed",
      updatedAt: Date.now(),
    });

    // Clear cart snapshot
    for (const item of cartItems) await ctx.db.delete(item._id);
    await ctx.db.delete(cart._id);

    return { orderId, subtotal, discount, total, appliedCoupon };
  },
});

// 2. Confirm Razorpay payment
export const confirmPayment = mutation({
  args: {
    orderId: v.id("orders"),
    razorpayPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      paymentStatus: "paid",
      razorpayPaymentId: args.razorpayPaymentId,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// Queries
export const getOrders = query({
  args: { authId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", args.authId))
      .first();
    if (!user) return [];
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => ctx.db.get(args.orderId),
});

export const markPaymentFailed = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    // Only patch fields we know exist in the schema (avoid razorpayOrderId if schema doesn't expect it)
    await ctx.db.patch(args.orderId, {
      paymentStatus: "failed",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/* 1) Get all orders */
export const getAllOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

// allowed transitions for order.status
const allowedTransitions: Record<string, string[]> = {
  // from -> allowed to
  placed: ["pending", "processing", "cancelled", "canceled"],
  pending: ["processing", "cancelled", "canceled"],
  processing: ["shipped", "completed", "cancelled", "canceled"],
  shipped: ["delivered", "completed", "cancelled", "canceled"],
  completed: [], // completed is terminal in this map
  delivered: ["completed"], // delivered -> completed (if you want)
  cancelled: [], // cancelled terminal
  canceled: [], // accepted alternate spelling
  // allow an empty current status to be set to any of these
  "": [
    "placed",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
    "canceled",
  ],
};

// allowed transitions for paymentStatus
const allowedPaymentTransitions: Record<string, string[]> = {
  pending: ["paid", "failed", "cod"],
  paid: [], // once paid, we don't expect to change (generally)
  failed: ["pending", "paid"],
  cod: ["paid", "failed"],
  "": ["pending", "paid", "failed", "cod"],
};

function isAllowedTransition(
  allowedMap: Record<string, string[]>,
  current: string | undefined,
  next: string
) {
  const cur = (current ?? "").toString();
  // if identical, allow
  if (cur === next) return true;
  const allowed = allowedMap[cur];
  if (!allowed) {
    // if no explicit rule, be conservative: disallow unless next === cur
    return false;
  }
  return allowed.includes(next);
}

export const getOrdersPage = query({
  args: {
    page: v.number(),
    pageSize: v.number(),
    status: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { page, pageSize, status, paymentStatus, search } = args;

    let initial: any[] = [];

    if (status) {
      initial = await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else if (paymentStatus) {
      initial = await ctx.db
        .query("orders")
        .withIndex("by_paymentStatus", (q) =>
          q.eq("paymentStatus", paymentStatus)
        )
        .collect();
    } else {
      initial = await ctx.db.query("orders").collect();
    }

    // additional filter
    let filtered = initial;
    if (status && paymentStatus) {
      filtered = filtered.filter(
        (o: any) => (o.paymentStatus ?? "") === paymentStatus
      );
    }

    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((o: any) => {
        if (!o) return false;
        if ((o._id ?? "").toString().toLowerCase().includes(q)) return true;
        if ((o.userId ?? "").toString().toLowerCase().includes(q)) return true;
        if ((o.razorpayOrderId ?? "").toString().toLowerCase().includes(q))
          return true;
        if ((o.razorpayPaymentId ?? "").toString().toLowerCase().includes(q))
          return true;
        if (Array.isArray(o.items)) {
          for (const it of o.items) {
            if ((it.name ?? "").toString().toLowerCase().includes(q))
              return true;
          }
        }
        return false;
      });
    }

    filtered.sort((a: any, b: any) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

    const total = filtered.length;
    const start = Math.max(0, (page - 1) * pageSize);
    const end = Math.min(filtered.length, start + pageSize);
    const pageItems = filtered.slice(start, end);

    // --- NEW: load user records for the page items ---
    // Build a map of unique userId -> representative id object
    const userIdMap: Record<string, any> = {};
    for (const o of pageItems) {
      if (!o || !o.userId) continue;
      const key = String(o.userId);
      if (!userIdMap[key]) userIdMap[key] = o.userId;
    }

    // Fetch user records (one db.get per distinct id)
    const userIdObjs = Object.values(userIdMap);
    const users: any[] = [];
    for (const idObj of userIdObjs) {
      try {
        const u = await ctx.db.get(idObj);
        if (u) users.push(u);
      } catch (e) {
        // ignore fetch failures for a user (user might have been deleted)
      }
    }

    const userMap: Record<string, any> = {};
    for (const u of users) {
      userMap[String(u._id)] = u;
    }

    // Attach userName/userEmail to each page item for client convenience
    const itemsWithUser = pageItems.map((o: any) => {
      const user = o.userId ? userMap[String(o.userId)] : undefined;
      const userName = user?.name ?? null;
      const userEmail = user?.email ?? null;
      return { ...o, userName, userEmail };
    });

    return { items: itemsWithUser, total };
  },
});

export const updateOrderStatus = mutation({
  args: { orderId: v.id("orders"), status: v.string() },
  handler: async ({ db }, args) => {
    const order = await db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const current = order.status ?? "";
    const next = args.status;

    // server-side guard
    if (!isAllowedTransition(allowedTransitions, current, next)) {
      throw new Error(`Invalid status transition: "${current}" → "${next}"`);
    }

    await db.patch(args.orderId, { status: next, updatedAt: Date.now() });
    return await db.get(args.orderId);
  },
});

export const updateOrderPaymentStatus = mutation({
  args: { orderId: v.id("orders"), paymentStatus: v.string() },
  handler: async ({ db }, args) => {
    const order = await db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    const current = order.paymentStatus ?? "";
    const next = args.paymentStatus;

    if (!isAllowedTransition(allowedPaymentTransitions, current, next)) {
      throw new Error(
        `Invalid paymentStatus transition: "${current}" → "${next}"`
      );
    }

    await db.patch(args.orderId, {
      paymentStatus: next,
      updatedAt: Date.now(),
    });
    return await db.get(args.orderId);
  },
});

export const updateOrder = mutation({
  args: {
    orderId: v.id("orders"),

    userId: v.optional(v.id("users")),
    addressId: v.optional(v.id("addresses")),
    items: v.optional(
      v.array(
        v.object({
          productId: v.id("products"),
          name: v.string(),
          size: v.optional(v.string()),
          color: v.optional(v.string()),
          quantity: v.number(),
          price: v.number(),
          image: v.optional(v.string()),
        })
      )
    ),
    subtotal: v.optional(v.number()),
    discount: v.optional(v.number()),
    total: v.optional(v.number()),
    paymentStatus: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    razorpayOrderId: v.optional(v.string()),
    razorpayPaymentId: v.optional(v.string()),
    status: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  },

  handler: async ({ db }, args) => {
    const order = await db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    // Check guarded transitions
    if (typeof args.status !== "undefined") {
      const current = order.status ?? "";
      const next = args.status;
      if (!isAllowedTransition(allowedTransitions, current, next)) {
        throw new Error(`Invalid status transition: "${current}" → "${next}"`);
      }
    }

    if (typeof args.paymentStatus !== "undefined") {
      const currentP = order.paymentStatus ?? "";
      const nextP = args.paymentStatus;
      if (!isAllowedTransition(allowedPaymentTransitions, currentP, nextP)) {
        throw new Error(
          `Invalid paymentStatus transition: "${currentP}" → "${nextP}"`
        );
      }
    }

    // Build updates skipping undefined
    const { orderId, ...maybe } = args as any;
    const updates: Record<string, unknown> = {};
    for (const k of Object.keys(maybe)) {
      const v = maybe[k];
      if (typeof v !== "undefined") updates[k] = v;
    }

    if (typeof updates.updatedAt === "undefined")
      updates.updatedAt = Date.now();

    if (Object.keys(updates).length === 0) return order;

    await db.patch(args.orderId, updates);
    return await db.get(args.orderId);
  },
});
