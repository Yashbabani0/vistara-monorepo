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
import type * as categories from "../categories.js";
import type * as collections from "../collections.js";
import type * as createProduct from "../createProduct.js";
import type * as deleteProduct from "../deleteProduct.js";
import type * as getAllUsers from "../getAllUsers.js";
import type * as policies from "../policies.js";
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
  categories: typeof categories;
  collections: typeof collections;
  createProduct: typeof createProduct;
  deleteProduct: typeof deleteProduct;
  getAllUsers: typeof getAllUsers;
  policies: typeof policies;
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
