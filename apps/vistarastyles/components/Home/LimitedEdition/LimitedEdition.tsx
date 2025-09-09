"use client";
import ProductCard from "@/components/Products/ProductCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

export default function LimitedEdition() {
  const products = useQuery(api.viewProducts.getLimitedEdition);
  if (products === undefined) {
    return <p className="text-center mx-auto my-14">Loading products...</p>;
  }

  if (products.length === 0) {
    return <p className="hidden"></p>;
  }
  return (
    <div className="flex flex-col items-start gap-4 w-full justify-center p-4 sm:p-8 max-w-7xl mx-auto ">
      <h2 className="font-bold text-2xl">Limited Edition</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            product={{ id: product._id, ...product }}
          />
        ))}
      </div>
    </div>
  );
}
