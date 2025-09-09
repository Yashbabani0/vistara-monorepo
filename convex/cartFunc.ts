// convex/cartFunc.ts
import { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// get cart by user
export const getByUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId as Id<"users">))
      .first();

    if (!cart) return null;

    const items = await ctx.db
      .query("cart_items")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();

    return { ...cart, items };
  },
});

// create new cart
export const createCart = mutation({
  args: {
    userId: v.id("users"),
    status: v.string(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("carts", {
      userId: args.userId,
      status: args.status,
      updatedAt: args.updatedAt,
    });
  },
});

// add or update cart item
export const addOrUpdateCartItem = mutation({
  args: {
    cartId: v.id("carts"),
    productId: v.id("products"),
    size: v.optional(v.string()),
    color: v.optional(v.string()),
    quantity: v.number(),
    priceSnapshot: v.number(),
    productName: v.string(),
    productImage: v.string(),
    realPrice: v.number(),
    showPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cart_items")
      .withIndex("by_cart_product", (q) =>
        q.eq("cartId", args.cartId).eq("productId", args.productId)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("size"), args.size ?? null),
          q.eq(q.field("color"), args.color ?? null)
        )
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + args.quantity,
      });
    } else {
      await ctx.db.insert("cart_items", {
        cartId: args.cartId,
        productId: args.productId,
        size: args.size ?? undefined,
        color: args.color ?? undefined,
        quantity: args.quantity,
        priceSnapshot: args.priceSnapshot,
        productName: args.productName,
        productImage: args.productImage,
        realPrice: args.realPrice,
        showPrice: args.showPrice,
      });
    }

    const cart = await ctx.db.get(args.cartId);
    const items = await ctx.db
      .query("cart_items")
      .withIndex("by_cart", (q) => q.eq("cartId", args.cartId))
      .collect();

    return { cart, items };
  },
});

// update cart item quantity
export const updateCartItemQty = mutation({
  args: { cartItemId: v.id("cart_items"), quantity: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.cartItemId);
    if (!existing) return null;

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    }

    const items = await ctx.db
      .query("cart_items")
      .withIndex("by_cart", (q) => q.eq("cartId", existing.cartId))
      .collect();

    const cart = await ctx.db.get(existing.cartId);
    return { cart, items };
  },
});

// remove cart item
export const removeCartItem = mutation({
  args: { cartItemId: v.id("cart_items") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.cartItemId);
    if (!existing) return null;

    await ctx.db.delete(args.cartItemId);

    const items = await ctx.db
      .query("cart_items")
      .withIndex("by_cart", (q) => q.eq("cartId", existing.cartId))
      .collect();

    const cart = await ctx.db.get(existing.cartId);
    return { cart, items };
  },
});

// clear cart
export const clearCart = mutation({
  args: { cartId: v.id("carts") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("cart_items")
      .withIndex("by_cart", (q) => q.eq("cartId", args.cartId))
      .collect();

    for (const it of items) {
      await ctx.db.delete(it._id);
    }

    const cart = await ctx.db.get(args.cartId);
    return { cart, items: [] };
  },
});

// merge guest cart
export const mergeGuestCart = mutation({
  args: {
    userId: v.id("users"),
    guestItems: v.array(
      v.object({
        productId: v.id("products"),
        size: v.optional(v.string()),
        color: v.optional(v.string()),
        quantity: v.number(),
        priceSnapshot: v.number(),
        productName: v.string(),
        productImage: v.string(),
        realPrice: v.number(),
        showPrice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!cart) {
      const cartId = await ctx.db.insert("carts", {
        userId: args.userId,
        status: "active",
        updatedAt: Date.now(),
      });
      cart = await ctx.db.get(cartId);
    }

    if (!cart) {
      throw new Error("Unable to create or fetch cart!");
    }

    for (const gi of args.guestItems) {
      const existing = await ctx.db
        .query("cart_items")
        .withIndex("by_cart_product", (q) =>
          q.eq("cartId", cart._id).eq("productId", gi.productId)
        )
        .filter((q) =>
          q.and(
            q.eq(q.field("size"), gi.size ?? null),
            q.eq(q.field("color"), gi.color ?? null)
          )
        )
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          quantity: existing.quantity + gi.quantity,
        });
      } else {
        await ctx.db.insert("cart_items", {
          cartId: cart._id,
          productId: gi.productId,
          size: gi.size ?? undefined,
          color: gi.color ?? undefined,
          quantity: gi.quantity,
          priceSnapshot: gi.priceSnapshot,
          productName: gi.productName,
          productImage: gi.productImage,
          realPrice: gi.realPrice,
          showPrice: gi.showPrice,
        });
      }
    }

    const items = await ctx.db
      .query("cart_items")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();

    return { cart, items };
  },
});

// convex/cartFunc.ts
export const getCartCountByAuth = query({
  args: { authId: v.optional(v.string()) }, // 👈 allow undefined
  handler: async (ctx, args) => {
    if (!args.authId) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", args.authId!))
      .first();

    if (!user) return 0;

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) return 0;

    const items = await ctx.db
      .query("cart_items")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();

    return items.reduce((acc, it) => acc + it.quantity, 0);
  },
});
