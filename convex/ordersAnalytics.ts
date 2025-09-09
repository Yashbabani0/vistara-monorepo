// convex/ordersAnalytics.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * getSalesSummary
 * args: { from?: number, to?: number } timestamps (ms)
 * returns: { totalRevenue, totalOrders, avgOrderValue, refundsAmount, cancelledCount }
 */
export const getSalesSummary = query({
  args: {
    from: v.optional(v.number()),
    to: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const from = args.from ?? 0;
    const to = args.to ?? Date.now();

    const orders = await ctx.db.query("orders").collect();

    let totalRevenue = 0;
    let totalOrders = 0;
    let refundsAmount = 0;
    let cancelledCount = 0;

    for (const o of orders) {
      const ts = o.updatedAt ?? 0;
      if (ts < from || ts > to) continue;
      if (o.status === "cancelled" || o.status === "canceled") {
        cancelledCount++;
        refundsAmount += o.total ?? 0;
      } else {
        totalRevenue += o.total ?? 0;
        totalOrders++;
      }
    }

    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      refundsAmount,
      cancelledCount,
    };
  },
});

/**
 * getDailySales
 * args: { from?: number, to?: number, tz?: string }
 * returns: [{ date: 'YYYY-MM-DD', revenue, ordersCount }]
 * - uses locale 'en-CA' + timezone 'Asia/Kolkata' to produce ISO date YYYY-MM-DD
 */
export const getDailySales = query({
  args: {
    from: v.optional(v.number()),
    to: v.optional(v.number()),
    tz: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const from = args.from ?? 0;
    const to = args.to ?? Date.now();
    const tz = args.tz ?? "Asia/Kolkata";

    const orders = await ctx.db.query("orders").collect();

    const map: Record<string, { revenue: number; orders: number }> = {};

    for (const o of orders) {
      const ts = o.updatedAt ?? 0;
      if (ts < from || ts > to) continue;
      if (o.status === "cancelled" || o.status === "canceled") continue; // skip canceled revenue

      // create date string in timezone (YYYY-MM-DD)
      let dateKey: string;
      try {
        dateKey = new Date(ts).toLocaleDateString("en-CA", { timeZone: tz });
      } catch (e) {
        // fallback
        dateKey = new Date(ts).toISOString().slice(0, 10);
      }

      if (!map[dateKey]) map[dateKey] = { revenue: 0, orders: 0 };
      map[dateKey].revenue += o.total ?? 0;
      map[dateKey].orders += 1;
    }

    // convert to sorted array
    const res = Object.keys(map)
      .sort()
      .map((d) => ({
        date: d,
        revenue: map[d].revenue,
        orders: map[d].orders,
      }));

    return res;
  },
});

/**
 * getTopProducts
 * args: { from?: number, to?: number, limit?: number }
 * returns: [{ productId, name, revenue, quantity }]
 */
export const getTopProducts = query({
  args: {
    from: v.optional(v.number()),
    to: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const from = args.from ?? 0;
    const to = args.to ?? Date.now();
    const limit = args.limit ?? 10;

    const orders = await ctx.db.query("orders").collect();
    const agg: Record<string, { name: string; revenue: number; qty: number }> =
      {};

    for (const o of orders) {
      const ts = o.updatedAt ?? 0;
      if (ts < from || ts > to) continue;
      if (!Array.isArray(o.items)) continue;
      if (o.status === "cancelled" || o.status === "canceled") continue;

      for (const it of o.items) {
        const pid = String(
          it.productId ?? it.productId?._id ?? it.name ?? "unknown"
        );
        if (!agg[pid]) agg[pid] = { name: it.name ?? pid, revenue: 0, qty: 0 };
        agg[pid].revenue += (it.price ?? 0) * (it.quantity ?? 1);
        agg[pid].qty += it.quantity ?? 1;
      }
    }

    const arr = Object.keys(agg).map((k) => ({ productId: k, ...agg[k] }));
    arr.sort((a, b) => b.revenue - a.revenue);
    return arr.slice(0, limit);
  },
});

// convex/ordersAnalytics.ts (replace getRevenueByCategory)
export const getRevenueByCategory = query({
  args: { from: v.optional(v.number()), to: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const from = args.from ?? 0;
    const to = args.to ?? Date.now();

    // load products map (id -> categoryId, name)
    const products = await ctx.db.query("products").collect();
    const productMap: Record<string, any> = {};
    for (const p of products) productMap[String(p._id)] = p;

    // load categories map (id -> name)
    const categories = await ctx.db.query("categories").collect();
    const categoryMap: Record<string, string> = {};
    for (const c of categories) {
      categoryMap[String(c._id)] = c.name ?? String(c._id);
    }

    const orders = await ctx.db.query("orders").collect();
    const categoryAgg: Record<string, { revenue: number; qty: number }> = {};

    for (const o of orders) {
      const ts = o.updatedAt ?? 0;
      if (ts < from || ts > to) continue;
      if (o.status === "cancelled" || o.status === "canceled") continue;
      if (!Array.isArray(o.items)) continue;

      for (const it of o.items) {
        // Some items store productId as id object, string, or missing — normalize to string
        const pid = it.productId ? String(it.productId) : null;
        const prod = pid ? productMap[pid] : undefined;
        const catId = prod?.categoryId
          ? String(prod.categoryId)
          : "Uncategorized";
        if (!categoryAgg[catId]) categoryAgg[catId] = { revenue: 0, qty: 0 };
        categoryAgg[catId].revenue += (it.price ?? 0) * (it.quantity ?? 1);
        categoryAgg[catId].qty += it.quantity ?? 1;
      }
    }

    return Object.keys(categoryAgg).map((k) => ({
      categoryId: k,
      categoryName:
        categoryMap[k] ?? (k === "Uncategorized" ? "Uncategorized" : String(k)),
      revenue: categoryAgg[k].revenue,
      qty: categoryAgg[k].qty,
    }));
  },
});

/**
 * getOrdersByStatus and payment breakdown
 */
export const getOrdersByStatus = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const byStatus: Record<string, number> = {};
    const byPaymentMethod: Record<string, number> = {};
    for (const o of orders) {
      const s = o.status ?? "unknown";
      byStatus[s] = (byStatus[s] || 0) + 1;
      const pm = o.paymentMethod ?? "unknown";
      byPaymentMethod[pm] = (byPaymentMethod[pm] || 0) + 1;
    }
    return { byStatus, byPaymentMethod };
  },
});

/**
 * getTopCustomers
 * returns top N users by revenue
 */
export const getTopCustomers = query({
  args: {
    from: v.optional(v.number()),
    to: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const from = args.from ?? 0;
    const to = args.to ?? Date.now();
    const limit = args.limit ?? 10;

    const orders = await ctx.db.query("orders").collect();
    const agg: Record<string, { revenue: number; orders: number }> = {};

    for (const o of orders) {
      const ts = o.updatedAt ?? 0;
      if (ts < from || ts > to) continue;
      if (!o.userId) continue;
      if (o.status === "cancelled" || o.status === "canceled") continue;
      const uid = String(o.userId);
      if (!agg[uid]) agg[uid] = { revenue: 0, orders: 0 };
      agg[uid].revenue += o.total ?? 0;
      agg[uid].orders += 1;
    }

    const arr = Object.keys(agg).map((k) => ({ userId: k, ...agg[k] }));
    arr.sort((a, b) => b.revenue - a.revenue);
    return arr.slice(0, limit);
  },
});

/**
 * exportSalesCSV - returns an array of rows (caller can transform to CSV client-side)
 */
export const exportSalesCSV = query({
  args: { from: v.optional(v.number()), to: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const from = args.from ?? 0;
    const to = args.to ?? Date.now();
    const orders = await ctx.db.query("orders").collect();
    const rows: any[] = [];
    for (const o of orders) {
      const ts = o.updatedAt ?? 0;
      if (ts < from || ts > to) continue;
      rows.push({
        orderId: o._id,
        userId: o.userId ?? "",
        total: o.total ?? 0,
        subtotal: o.subtotal ?? 0,
        discount: o.discount ?? 0,
        paymentStatus: o.paymentStatus ?? "",
        paymentMethod: o.paymentMethod ?? "",
        status: o.status ?? "",
        updatedAt: o.updatedAt ?? 0,
      });
    }
    return rows;
  },
});
