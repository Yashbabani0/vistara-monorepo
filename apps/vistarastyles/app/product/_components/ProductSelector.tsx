// components/ProductSelector.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";

interface ProductColor {
  name: string;
  hex: string;
}

interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
}

interface Product {
  _id: any;
  name: string;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  images: ProductImage[];
  showPrice: number;
  realPrice: number;
}

interface ProductSelectorProps {
  product: Product;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  product,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Initialize selected size (first size)
  useEffect(() => {
    if (product && !selectedSize && product.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  // Initialize selected color only once
  useEffect(() => {
    if (product && !selectedColor && product.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  const savings =
    product.showPrice > product.realPrice
      ? product.showPrice - product.realPrice
      : 0;

  return (
    <div className="space-y-6">
      {/* Price Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.realPrice.toLocaleString()}
            </span>
            {product.showPrice > product.realPrice && (
              <span className="text-xl line-through text-gray-500">
                ₹{product.showPrice.toLocaleString()}
              </span>
            )}
          </div>
          {savings > 0 && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Save ₹{savings.toLocaleString()}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Inclusive of all taxes • Free shipping on all orders
        </p>
      </div>

      {/* Colors */}
      {product.colors?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Color: {selectedColor?.name || "Select Color"}
          </h3>
          <div className="flex gap-3 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setSelectedColor(color)}
                className={`relative w-8 h-8 rounded-full transition-all ${
                  selectedColor?.hex === color.hex
                    ? "border-gray-800 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {selectedColor?.hex === color.hex && (
                  <div className="absolute inset-1 rounded-full border-2 border-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Size: {selectedSize || "Select Size"}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${
                  selectedSize === size
                    ? "bg-yellow-500 text-white border-yellow-500 shadow-md"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-3 font-medium min-w-[3rem] text-center border-x">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-600">
            Total: ₹{(product.realPrice * quantity).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <AddToCartButton
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={quantity}
          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-4 shadow-lg hover:shadow-xl transition-all w-full cursor-pointer"
        />
        <BuyNowButton
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={quantity}
          className="flex-1 w-full border border-yellow-500 bg-transparent text-yellow-500 cursor-pointer font-semibold py-4 flex items-center justify-center gap-2 h-10 rounded-md hover:shadow-xl"
        />
      </div>
    </div>
  );
};
