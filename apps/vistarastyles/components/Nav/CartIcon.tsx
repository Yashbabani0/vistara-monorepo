import { ShoppingBag, ShoppingCart } from "lucide-react";
import React from "react";
import Link from "next/link";

export default function CartIcon() {
  const cartCount = 0;

  return (
    <div className="relative">
      <Link href="/cart" className="relative flex items-center justify-center">
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {cartCount}
          </div>
        )}
      </Link>
    </div>
  );
}
