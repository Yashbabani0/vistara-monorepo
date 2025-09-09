// convex/heroBanners.ts
import { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

type HeroBannerPatch = Partial<{
  title?: Id<"heroBanners">;
  pcImageUrl?: string;
  pcAltText?: string;
  tabletImageUrl?: string;
  tabletAltText?: string;
  mobileImageUrl?: string;
  mobileAltText?: string;
  url?: string;
  isActive?: boolean;
}>;

export const getAll = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("heroBanners").collect();

    all.sort((a, b) => {
      const aUpdated = a.updatedAt ?? 0;
      const bUpdated = b.updatedAt ?? 0;
      if (bUpdated !== aUpdated) return bUpdated - aUpdated;
      return (b._creationTime ?? 0) - (a._creationTime ?? 0);
    });

    return all;
  },
});

export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("heroBanners")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getByTitle = query({
  args: { title: v.string() },
  handler: async (ctx, { title }) => {
    return await ctx.db
      .query("heroBanners")
      .filter((q) => q.eq(q.field("title"), title))
      .first();
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    pcImageUrl: v.string(),
    pcAltText: v.optional(v.string()),
    tabletImageUrl: v.optional(v.string()),
    tabletAltText: v.optional(v.string()),
    mobileImageUrl: v.optional(v.string()),
    mobileAltText: v.optional(v.string()),
    url: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const doc = {
      ...args,
      isActive: args.isActive === undefined ? true : args.isActive,
      updatedAt: now,
    };
    const id = await ctx.db.insert("heroBanners", doc);
    return { ok: true, id };
  },
});

export const update = mutation({
  args: {
    id: v.id("heroBanners"),
    title: v.optional(v.string()),
    pcImageUrl: v.optional(v.string()),
    pcAltText: v.optional(v.string()),
    tabletImageUrl: v.optional(v.string()),
    tabletAltText: v.optional(v.string()),
    mobileImageUrl: v.optional(v.string()),
    mobileAltText: v.optional(v.string()),
    url: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const patch: Record<string, any> = { updatedAt: Date.now() };

    for (const k of Object.keys(rest) as Array<keyof typeof rest>) {
      const val = rest[k];
      if (val !== undefined) patch[k as string] = val;
    }

    await ctx.db.patch(id, patch);
    return { ok: true, id };
  },
});

export const remove = mutation({
  args: { id: v.id("heroBanners") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { ok: true, id };
  },
});

export const softDelete = mutation({
  args: { id: v.id("heroBanners") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isActive: false, updatedAt: Date.now() });
    return { ok: true, id };
  },
});

export const restore = mutation({
  args: { id: v.id("heroBanners") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isActive: true, updatedAt: Date.now() });
    return { ok: true, id };
  },
});
