// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authId: v.string(), // Clerk userId
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),

    role: v.string(), // e.g. "admin", "customer"
  })
    .index("by_authId", ["authId"])
    .index("by_email", ["email"]),

  categories: defineTable({
    name: v.string(), // e.g. "T-Shirts"
    slug: v.string(), // e.g. "t-shirts"
  }).index("by_slug", ["slug"]),

  collections: defineTable({
    name: v.string(), // e.g. "Summer 2025"
    slug: v.string(), // e.g. "summer-2025"
  }).index("by_slug", ["slug"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    sizes: v.array(v.string()),
    colors: v.array(
      v.object({
        name: v.string(),
        hex: v.string(),
      })
    ),
    images: v.array(
      v.object({
        url: v.string(),
        alt: v.optional(v.string()),
        position: v.optional(v.number()),
      })
    ),
    isActive: v.optional(v.boolean()),
    isFastSelling: v.optional(v.boolean()),
    isOnSale: v.optional(v.boolean()),
    isNewArrival: v.optional(v.boolean()),
    isLimitedEdition: v.optional(v.boolean()),
    showPrice: v.number(),
    realPrice: v.number(),
    categoryId: v.optional(v.id("categories")),
    collectionIds: v.optional(v.array(v.id("collections"))),
    taxRate: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_collection", ["collectionIds"])
    .index("by_new_arrival", ["isNewArrival"])
    .index("by_limited_edition", ["isLimitedEdition"])
    .index("by_category", ["categoryId"])
    .index("by_active", ["isActive"])
    .index("by_sale", ["isOnSale"])
    .index("by_fast_selling", ["isFastSelling"])
    .index("by_price", ["showPrice"])
    .index("by_real_price", ["realPrice"])
    .index("by_tax_rate", ["taxRate"]),

  carts: defineTable({
    userId: v.id("users"),
    status: v.string(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  cart_items: defineTable({
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
  })
    .index("by_cart", ["cartId"])
    .index("by_product", ["productId"])
    .index("by_cart_product", ["cartId", "productId"]),

  newsletters: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),

  addresses: defineTable({
    userId: v.id("users"),
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
  }).index("by_user", ["userId"]),

  orders: defineTable({
    userId: v.id("users"),
    addressId: v.id("addresses"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        size: v.optional(v.string()),
        color: v.optional(v.string()),
        quantity: v.number(),
        price: v.number(), // final charged price per item
        image: v.optional(v.string()),
      })
    ),
    subtotal: v.number(), // before discount
    discount: v.optional(v.number()), // applied discount if any
    total: v.number(), // final payable amount
    paymentStatus: v.string(), // "pending" | "paid" | "failed" | "cod"
    paymentMethod: v.string(), // "razorpay" | "cod" | "stripe" etc
    razorpayOrderId: v.optional(v.string()), // store gateway ref
    razorpayPaymentId: v.optional(v.string()),
    status: v.string(), // "placed" | "shipped" | "delivered" | "cancelled"
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_paymentStatus", ["paymentStatus"])
    .index("by_status", ["status"]),

  coupons: defineTable({
    code: v.string(), // e.g. "SUMMER25"
    description: v.optional(v.string()),

    type: v.union(v.literal("percentage"), v.literal("fixed")),
    value: v.number(), // percentage (10 = 10%) or fixed amount (500 = ₹500 off)

    minOrderAmount: v.optional(v.number()), // e.g. only valid if order >= ₹2000
    maxDiscount: v.optional(v.number()), // cap discount (useful for percentage)

    isActive: v.boolean(),
    validFrom: v.optional(v.number()), // timestamp
    validTo: v.optional(v.number()), // timestamp
    usageLimit: v.optional(v.number()), // global usage count
    usedCount: v.optional(v.number()), // how many times used

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_code", ["code"]),

  heroBanners: defineTable({
    title: v.optional(v.string()),
    pcImageUrl: v.string(), // required
    pcAltText: v.optional(v.string()),
    tabletImageUrl: v.optional(v.string()),
    tabletAltText: v.optional(v.string()),
    mobileImageUrl: v.optional(v.string()),
    mobileAltText: v.optional(v.string()),
    url: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_isActive", ["isActive"])
    .index("by_title", ["title"]),

  daily_sales: defineTable({
    // ISO date key (YYYY-MM-DD) in your reporting timezone (we'll use Asia/Kolkata for keys)
    date: v.string(),

    // totals for non-cancelled orders
    revenue: v.number(),
    orders: v.number(),

    // canceled/refunded metrics
    canceledRevenue: v.number(),
    canceledOrders: v.number(),

    // housekeeping
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"]),
});
