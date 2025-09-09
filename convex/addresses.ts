// convex/addresses.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addAddress = mutation({
  args: {
    authId: v.string(), // Clerk user id
    fullName: v.string(),
    phone: v.string(),
    line1: v.string(),
    line2: v.optional(v.string()),
    line3: v.optional(v.string()),
    landmark: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    pincode: v.string(),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // ✅ find convex user by Clerk authId
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", args.authId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (args.isDefault) {
      const existing = await ctx.db
        .query("addresses")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      for (const addr of existing) {
        if (addr.isDefault) {
          await ctx.db.patch(addr._id, { isDefault: false });
        }
      }
    }

    const addressId = await ctx.db.insert("addresses", {
      userId: user._id,
      fullName: args.fullName,
      phone: args.phone,
      line1: args.line1,
      line2: args.line2,
      line3: args.line3,
      landmark: args.landmark,
      city: args.city,
      state: args.state,
      pincode: args.pincode,
      isDefault: args.isDefault ?? false,
    });

    return addressId;
  },
});

export const getAddresses = query({
  args: { authId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", args.authId))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const deleteAddress = mutation({
  args: { addressId: v.id("addresses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.addressId);
  },
});
