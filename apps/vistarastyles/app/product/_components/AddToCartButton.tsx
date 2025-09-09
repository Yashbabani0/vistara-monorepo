// components/AddToCartButton.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

interface ProductColor {
  name: string;
  hex: string;
}

interface AddToCartButtonProps {
  product: {
    _id: Id<"products">;
    name: string;
    showPrice: number;
    realPrice: number;
    images: { url: string; alt?: string }[];
  };
  selectedSize: string | null;
  selectedColor: ProductColor | null;
  quantity: number;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
  disabled = false,
  className = "",
  variant = "default",
  size = "lg",
  showIcon = true,
  children,
}) => {
  const { addToCart, isLoading, isGuestMode } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    // Validation
    if (!selectedSize && product) {
      toast.error("Please select a size");
      return;
    }

    setIsAdding(true);

    try {
      const success = await addToCart({
        productId: product._id,
        size: selectedSize || undefined,
        color: selectedColor?.name || undefined,
        quantity,
        priceSnapshot: product.realPrice,
        showPrice: product.showPrice,
        productName: product.name,
        productImage: product.images[0]?.url || "",
        realPrice: product.realPrice,
      });

      if (success) {
        if (isGuestMode) {
          toast.success("Item added to cart!", {
            description: `${product.name} has been added to your cart. Sign in to save your cart permanently.`,
            action: {
              label: "Sign In",
              onClick: () => router.push("/sign-in"),
            },
          });
        } else {
          toast.success("Item added to cart!", {
            description: `${product.name} has been added to your cart.`,
            action: {
              label: "View Cart",
              onClick: () => router.push("/cart"),
            },
            style: {
              background: "#000",
              color: "#fff",
            },
          });
        }
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const isButtonLoading = isLoading || isAdding;
  const isButtonDisabled = disabled || isButtonLoading || !product;

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleAddToCart}
      disabled={isButtonDisabled}
    >
      {isButtonLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        showIcon && <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      {children || (isButtonLoading ? "Adding..." : "Add to Cart")}
    </Button>
  );
};
