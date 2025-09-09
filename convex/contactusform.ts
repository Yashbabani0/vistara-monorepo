//  convex/contactusform.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createContact = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        subject: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("contacts", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const getAllContacts = query({
    handler: async (ctx) => {
        const contacts = await ctx.db.query("contacts").collect();
        return contacts;
    },
});