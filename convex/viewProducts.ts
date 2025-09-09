import { query } from "./_generated/server";
import { v } from "convex/values";

// Products
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
  },
});

// Active products
export const getByActive = query({
  args: { active: v.boolean() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), args.active))
      .collect();
  },
});

// Products by category (active only)
export const getByCategory = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (!category) return [];

    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", category._id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Products by collection (active only)
export const getByCollection = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const collection = await ctx.db
      .query("collections")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (!collection) return [];

    // use the index on collectionIds
    return await ctx.db
      .query("products")
      .withIndex("by_collection", (q) => q.eq("collectionIds", collection._id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Featured products
export const getFastSelling = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isFastSelling"), true))
      .collect();
  },
});

// New Arrivals
export const getNewArrivals = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isNewArrival"), true))
      .collect();
  },
});

// Limited Edition
export const getLimitedEdition = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isLimitedEdition"), true))
      .collect();
  },
});

// On Sale
export const getOnSale = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isOnSale"), true))
      .collect();
  },
});
