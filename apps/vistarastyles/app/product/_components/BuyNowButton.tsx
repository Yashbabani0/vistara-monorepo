"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

interface ProductColor {
  name: string;
  hex: string;
}

interface BuyNowButtonProps {
  product:
    | {
        _id: Id<"products">;
        name: string;
        showPrice: number;
        realPrice: number;
        images: { url: string; alt?: string }[];
      }
    | null
    | undefined;
  selectedSize: string | null;
  selectedColor: ProductColor | null;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
}

export const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
  disabled = false,
  className = "",
  children,
}) => {
  const { addToCart, isLoading, isGuestMode } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyNow = async () => {
    if (!product) return;

    // Validation: size required (same as AddToCart)
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsProcessing(true);
    try {
      const success = await addToCart({
        productId: product._id,
        size: selectedSize || undefined,
        color: selectedColor?.name || undefined,
        quantity,
        priceSnapshot: product.realPrice,
        showPrice: product.showPrice,
        productName: product.name,
        productImage: product.images?.[0]?.url || "",
        realPrice: product.realPrice,
      });

      if (!success) {
        toast.error("Failed to buy now. Please try again.");
        return;
      }

      // Success -> navigate to checkout
      if (isGuestMode) {
        const redirectParam = encodeURIComponent("/checkout");
        router.push(`/sign-in?redirectUrl=${redirectParam}`);
        toast.success(
          "Item added to cart. Please sign in to continue to checkout.",
          {
            action: {
              label: "Sign In",
              onClick: () =>
                router.push(`/sign-in?redirectUrl=${redirectParam}`),
            },
          }
        );
      } else {
        // For signed-in users go straight to checkout
        router.push("/checkout");
      }
    } catch (err) {
      console.error("Buy Now failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const loading = isLoading || isProcessing;
  const isDisabled = disabled || loading || !product;

  return (
    <button
      className={`${className}`}
      onClick={handleBuyNow}
      disabled={isDisabled}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4 mr-2" />
      )}
      {children || (loading ? "Processing..." : "Buy Now")}
    </button>
  );
};

export default BuyNowButton;
