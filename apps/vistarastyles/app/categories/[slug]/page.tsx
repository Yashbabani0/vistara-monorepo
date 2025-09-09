"use client";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductCard from "@/components/Products/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const products = useQuery(api.viewProducts.getByCategory, { slug });

  if (products === undefined) {
    return <p className="text-center mx-auto my-14">Loading products...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-center mt-8 text-muted-foreground my-14">
        No products found in this category
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 my-14 w-full">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={{ id: product._id, ...product }}
        />
      ))}
    </div>
  );
}
