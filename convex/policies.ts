// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";

// // Get all active policies
// export const getPolicies = query({
//   handler: async (ctx) => {
//     return await ctx.db
//       .query("policies")
//       .withIndex("by_active", (q) => q.eq("isActive", true))
//       .collect();
//   },
// });

// // Get single policy by key
// export const getPolicyByKey = query({
//   args: { key: v.string() },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("policies")
//       .withIndex("by_key", (q) => q.eq("key", args.key))
//       .unique();
//   },
// });

// // Add new policy
// export const addPolicy = mutation({
//   args: {
//     key: v.string(),
//     title: v.string(),
//     content: v.string(),
//     isActive: v.boolean(),
//   },
//   handler: async (ctx, args) => {
//     const now = Date.now();
//     const id = await ctx.db.insert("policies", {
//       ...args,
//       updatedAt: now,
//     });
//     return id;
//   },
// });

// // Edit/update policy
// export const editPolicy = mutation({
//   args: {
//     id: v.id("policies"),
//     title: v.string(),
//     content: v.string(),
//     isActive: v.boolean(),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.id, {
//       title: args.title,
//       content: args.content,
//       isActive: args.isActive,
//       updatedAt: Date.now(),
//     });
//     return { success: true };
//   },
// });

// // Delete policy
// export const deletePolicy = mutation({
//   args: { id: v.id("policies") },
//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//     return { success: true };
//   },
// });
