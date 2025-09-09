import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createProduct = mutation({
  args: {
    product: v.any(),
  },
  handler: async (ctx, { product }) => {
    const flags = product.flags || {};

    const isActive =
      flags.isActive !== undefined
        ? flags.isActive
        : product.isActive !== undefined
          ? product.isActive
          : undefined;

    const isFastSelling =
      flags.isFastSelling !== undefined
        ? flags.isFastSelling
        : product.isFastSelling !== undefined
          ? product.isFastSelling
          : undefined;

    const isOnSale =
      flags.isOnSale !== undefined
        ? flags.isOnSale
        : product.isOnSale !== undefined
          ? product.isOnSale
          : undefined;

    const isNewArrival =
      flags.isNewArrival !== undefined
        ? flags.isNewArrival
        : product.isNewArrival !== undefined
          ? product.isNewArrival
          : undefined;

    const isLimitedEdition =
      flags.isLimitedEdition !== undefined
        ? flags.isLimitedEdition
        : product.isLimitedEdition !== undefined
          ? product.isLimitedEdition
          : undefined;

    const id = await ctx.db.insert("products", {
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      images: product.images ?? [],
      sizes: product.sizes ?? [],
      colors: product.colors ?? [],
      categoryId: product.category ?? null,
      collectionIds: product.collections ?? [],
      showPrice: product.price ?? null,
      realPrice: product.salePrice ?? null,
      taxRate: product.taxRate,
      ...(isActive !== undefined ? { isActive } : {}),
      ...(isFastSelling !== undefined ? { isFastSelling } : {}),
      ...(isOnSale !== undefined ? { isOnSale } : {}),
      ...(isNewArrival !== undefined ? { isNewArrival } : {}),
      ...(isLimitedEdition !== undefined ? { isLimitedEdition } : {}),
    });

    return id;
  },
});
