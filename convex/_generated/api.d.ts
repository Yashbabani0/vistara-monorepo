/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as addresses from "../addresses.js";
import type * as cartFunc from "../cartFunc.js";
import type * as categories from "../categories.js";
import type * as collections from "../collections.js";
import type * as contactusform from "../contactusform.js";
import type * as createProduct from "../createProduct.js";
import type * as deleteProduct from "../deleteProduct.js";
import type * as editProduct from "../editProduct.js";
import type * as getAllUsers from "../getAllUsers.js";
import type * as heroBanners from "../heroBanners.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as ordersAnalytics from "../ordersAnalytics.js";
import type * as users from "../users.js";
import type * as viewProducts from "../viewProducts.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  addresses: typeof addresses;
  cartFunc: typeof cartFunc;
  categories: typeof categories;
  collections: typeof collections;
  contactusform: typeof contactusform;
  createProduct: typeof createProduct;
  deleteProduct: typeof deleteProduct;
  editProduct: typeof editProduct;
  getAllUsers: typeof getAllUsers;
  heroBanners: typeof heroBanners;
  newsletter: typeof newsletter;
  orders: typeof orders;
  ordersAnalytics: typeof ordersAnalytics;
  users: typeof users;
  viewProducts: typeof viewProducts;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
