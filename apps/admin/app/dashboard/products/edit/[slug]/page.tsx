"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  sizesCSV: string; // comma-separated
  colorsJSON: string; // JSON array of {name,hex}
  imagesJSON: string; // JSON array of {url,alt,position}
  isActive: boolean;
  isFastSelling: boolean;
  isOnSale: boolean;
  isNewArrival: boolean;
  isLimitedEdition: boolean;
  showPrice: number | "";
  realPrice: number | "";
  categoryId: string | "";
  collectionIdsCSV: string; // comma-separated ids
  taxRate: number | "";
};

export default function EditProductPage({ params }: { params: any }) {
  const useReactParams = (React as any).use as ((p: any) => any) | undefined;
  const resolvedParams = useReactParams ? useReactParams(params) : params;
  const { slug } = resolvedParams ?? {};
  const product = useQuery(api.viewProducts.getBySlug, { slug });
  const editProduct = useMutation(api.editProduct.editProduct);
  const router = useRouter();

  const [form, setForm] = useState<ProductFormState>({
    name: "",
    slug: "",
    description: "",
    sizesCSV: "",
    colorsJSON: "[]",
    imagesJSON: "[]",
    isActive: false,
    isFastSelling: false,
    isOnSale: false,
    isNewArrival: false,
    isLimitedEdition: false,
    showPrice: "",
    realPrice: "",
    categoryId: "",
    collectionIdsCSV: "",
    taxRate: "",
  });

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name ?? "",
      slug: product.slug ?? "",
      description: product.description ?? "",
      sizesCSV: Array.isArray(product.sizes) ? product.sizes.join(",") : "",
      colorsJSON: JSON.stringify(product.colors ?? [], null, 2),
      imagesJSON: JSON.stringify(product.images ?? [], null, 2),
      isActive: !!product.isActive,
      isFastSelling: !!product.isFastSelling,
      isOnSale: !!product.isOnSale,
      isNewArrival: !!product.isNewArrival,
      isLimitedEdition: !!product.isLimitedEdition,
      showPrice: typeof product.showPrice === "number" ? product.showPrice : "",
      realPrice: typeof product.realPrice === "number" ? product.realPrice : "",
      categoryId: product.categoryId ? String(product.categoryId) : "",
      collectionIdsCSV: Array.isArray(product.collectionIds)
        ? product.collectionIds.map(String).join(",")
        : "",
      taxRate: typeof product.taxRate === "number" ? product.taxRate : "",
    });
  }, [product]);

  if (product === undefined) {
    return (
      <div className="container mx-auto p-6 mt-20">
        <div>Loading product…</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 mt-20">
        <div>Product not found.</div>
        <Link href="/dashboard/products">Back to products</Link>
      </div>
    );
  }

  const handleChange = (k: keyof ProductFormState, v: any) =>
    setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse JSON inputs
    let parsedColors;
    let parsedImages;
    try {
      parsedColors = JSON.parse(form.colorsJSON);
      if (!Array.isArray(parsedColors))
        throw new Error("colors must be an array");
    } catch (err) {
      toast.error(
        "Invalid colors JSON. Expect an array of {name,hex} objects."
      );
      return;
    }
    try {
      parsedImages = JSON.parse(form.imagesJSON);
      if (!Array.isArray(parsedImages))
        throw new Error("images must be an array");
    } catch (err) {
      toast.error(
        "Invalid images JSON. Expect an array of {url,alt,position} objects."
      );
      return;
    }

    const sizes = form.sizesCSV
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const collectionIds = form.collectionIdsCSV
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Build payload; include slug (used to find the product server-side)
    const payload: any = {
      slug, // find product by existing slug on server
      // fields optional - only supplied when non-empty/changed
      name: form.name || undefined,
      // allow changing slug: if user updated slug field, send new slug as `newSlug`
      newSlug: form.slug && form.slug !== slug ? form.slug : undefined,
      description: form.description || undefined,
      sizes: sizes.length ? sizes : undefined,
      colors: parsedColors.length ? parsedColors : undefined,
      images: parsedImages.length ? parsedImages : undefined,
      isActive: !!form.isActive,
      isFastSelling: !!form.isFastSelling,
      isOnSale: !!form.isOnSale,
      isNewArrival: !!form.isNewArrival,
      isLimitedEdition: !!form.isLimitedEdition,
      showPrice: form.showPrice === "" ? undefined : Number(form.showPrice),
      realPrice: form.realPrice === "" ? undefined : Number(form.realPrice),
      categoryId: form.categoryId === "" ? undefined : form.categoryId,
      collectionIds: collectionIds.length ? collectionIds : undefined,
      taxRate: form.taxRate === "" ? undefined : Number(form.taxRate),
    };

    try {
      await editProduct(payload);
      toast.success("Product updated");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Edit failed", err);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="container mx-auto p-6 mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Slug (permalink)
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Changing slug will update the product URL.
                </p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Sizes (comma separated)
                </label>
                <input
                  value={form.sizesCSV}
                  onChange={(e) => handleChange("sizesCSV", e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Collection IDs (comma separated)
                </label>
                <input
                  value={form.collectionIdsCSV}
                  onChange={(e) =>
                    handleChange("collectionIdsCSV", e.target.value)
                  }
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Category ID</label>
                <input
                  value={form.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Show Price (₹)
                </label>
                <input
                  type="number"
                  value={form.showPrice as any}
                  onChange={(e) => handleChange("showPrice", e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Real Price (₹)
                </label>
                <input
                  type="number"
                  value={form.realPrice as any}
                  onChange={(e) => handleChange("realPrice", e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={form.taxRate as any}
                  onChange={(e) => handleChange("taxRate", e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">
                  Colors (JSON array of {"{name,hex}"})
                </label>
                <textarea
                  value={form.colorsJSON}
                  onChange={(e) => handleChange("colorsJSON", e.target.value)}
                  className="mt-1 block w-full border rounded p-2 font-mono text-sm"
                  rows={6}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">
                  Images (JSON array of {"{url,alt,position}"})
                </label>
                <textarea
                  value={form.imagesJSON}
                  onChange={(e) => handleChange("imagesJSON", e.target.value)}
                  className="mt-1 block w-full border rounded p-2 font-mono text-sm"
                  rows={6}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium">Flags</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        handleChange("isActive", e.target.checked)
                      }
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isNewArrival as any}
                      onChange={(e) =>
                        handleChange("isNewArrival" as any, e.target.checked)
                      }
                    />
                    New Arrival
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isOnSale as any}
                      onChange={(e) =>
                        handleChange("isOnSale" as any, e.target.checked)
                      }
                    />
                    On Sale
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isFastSelling as any}
                      onChange={(e) =>
                        handleChange("isFastSelling" as any, e.target.checked)
                      }
                    />
                    Fast Selling
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isLimitedEdition as any}
                      onChange={(e) =>
                        handleChange(
                          "isLimitedEdition" as any,
                          e.target.checked
                        )
                      }
                    />
                    Limited Edition
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Save changes</Button>
              <Link
                href="/dashboard/products/view"
                className="inline-flex items-center px-3 py-2 rounded-md border hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
