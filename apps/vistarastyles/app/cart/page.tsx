// File: app/cart/page.tsx
"use client";
import React from "react";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { UserPlus, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    isLoading,
    isGuestMode,
  } = useCart();

  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Discover amazing products and add them to your cart!
          </p>
          <Button
            onClick={() => router.push("/shop")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="md:flex justify-between md:w-full md:items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {totalItems} items in your cart
              </p>
            </div>
          </div>

          {isGuestMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 mt-0.5">💡</div>
                <div>
                  <p className="text-yellow-800 font-medium">
                    Guest Cart Active
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Your items are temporarily saved. Sign in to save your cart
                    permanently and access it from any device.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    const id =
                      "_id" in item
                        ? item._id
                        : `guest_${item.productId}_${
                            item.size || "nosize"
                          }_${item.color || "nocolor"}`;
                    return (
                      <div
                        key={id}
                        className="flex flex-col md:flex-row items-center md:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex w-full gap-4">
                          <div className="flex-shrink-0">
                            <Image
                              src={item.productImage || "/placeholder.png"}
                              alt={item.productName}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold capitalize text-gray-900 truncate">
                              {item.productName}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-bold text-lg text-gray-900">
                                ₹{item.priceSnapshot.toLocaleString()}
                              </span>
                              {item.showPrice !== item.priceSnapshot && (
                                <span className="text-[0.75em] text-gray-500 line-through">
                                  ₹{item.showPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex w-full flex-row-reverse md:flex-row items-center justify-between md:justify-end md:gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(id, item.quantity - 1)
                                }
                                disabled={isLoading || item.quantity <= 1}
                                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 rounded-full"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(id, item.quantity + 1)
                                }
                                disabled={isLoading}
                                className="p-2 hover:bg-gray-100 transition-colors rounded-full"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(id)}
                              disabled={isLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₹
                              {(
                                item.priceSnapshot * item.quantity
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white py-3 cursor-pointer"
              >
                Proceed to Checkout
              </Button>

              <div className="mt-2 text-center">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/shop")}
                  className="text-yellow-600 hover:text-yellow-700 w-full border cursor-pointer"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
