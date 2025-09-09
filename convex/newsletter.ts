import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Prevent duplicates
    const existing = await ctx.db
      .query("newsletters")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      return { success: false, message: "Already subscribed" };
    }

    await ctx.db.insert("newsletters", {
      email: args.email,
      createdAt: Date.now(),
    });

    // Don’t send mail from Convex — just return success
    return { success: true, message: "Subscribed successfully" };
  },
});
