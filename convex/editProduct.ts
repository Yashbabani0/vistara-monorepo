// convex/editProduct.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const editProduct = mutation({
  args: {
    // existing slug to find the product
    slug: v.string(),

    // supply newSlug if you want to change permalink
    newSlug: v.optional(v.string()),

    name: v.optional(v.string()),
    description: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    colors: v.optional(
      v.array(
        v.object({
          name: v.string(),
          hex: v.string(),
        })
      )
    ),
    images: v.optional(
      v.array(
        v.object({
          url: v.string(),
          alt: v.optional(v.string()),
          position: v.optional(v.number()),
        })
      )
    ),
    isActive: v.optional(v.boolean()),
    isFastSelling: v.optional(v.boolean()),
    isOnSale: v.optional(v.boolean()),
    isNewArrival: v.optional(v.boolean()),
    isLimitedEdition: v.optional(v.boolean()),
    showPrice: v.optional(v.number()),
    realPrice: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    collectionIds: v.optional(v.array(v.id("collections"))),
    taxRate: v.optional(v.number()),
  },

  handler: async ({ db }, args) => {
    // find product by slug
    const product = await db
      .query("products")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (!product) {
      throw new Error(`Product with slug "${args.slug}" not found`);
    }

    const { slug, newSlug, ...rest } = args as any;

    // build updates skipping undefined values
    const updates: Record<string, unknown> = {};
    for (const k of Object.keys(rest)) {
      const val = (rest as any)[k];
      if (typeof val !== "undefined") {
        updates[k] = val;
      }
    }

    // if newSlug provided, set slug to newSlug
    if (typeof newSlug !== "undefined") {
      updates.slug = newSlug;
    }

    if (Object.keys(updates).length === 0) {
      return product;
    }

    await db.patch(product._id, updates);
    const updated = await db.get(product._id);
    return updated;
  },
});
