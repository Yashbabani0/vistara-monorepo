// components/Nav/CartIcon.tsx
"use client";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CartIcon() {
  const { user } = useUser();
  const cartCount = useQuery(api.cartFunc.getCartCountByAuth, {
    authId: user?.id,
  });

  return (
    <div className="relative">
      <Link
        href="/cart"
        className="relative flex items-center justify-center hover:text-yellow-500 transition-all duration-300 ease-in-out"
      >
        <ShoppingBag className="w-5 h-5" />

        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {cartCount}
        </div>
      </Link>
    </div>
  );
}
