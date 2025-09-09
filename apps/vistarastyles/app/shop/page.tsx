"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductCard from "@/components/Products/ProductCard";

export default function ProductsGrid() {
  const products = useQuery(api.viewProducts.getByActive, { active: true });

  if (products === undefined) {
    return <p className="text-center mx-auto my-14">Loading products...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-center mt-8 text-muted-foreground m-auto w-full h-full my-14">
        No products available
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 my-14 w-screen mx-auto">
      {products.map((product: any) => (
        <ProductCard
          key={product._id}
          product={{ id: product._id, ...product }}
        />
      ))}
    </div>
  );
}
