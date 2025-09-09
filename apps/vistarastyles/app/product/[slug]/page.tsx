  // apps/vistarastyles/app/product/[slug]/page.tsx
  "use client";
  import { useParams } from "next/navigation";
  import { useQuery } from "convex/react";
  import { api } from "@/convex/_generated/api";
  import Image from "next/image";
  import { useState, useEffect } from "react";
  import { Badge } from "@/components/ui/badge";
  import {
    Truck,
    CreditCard,
    RotateCcw,
    Zap,
    Clock,
    Sparkles,
    ChevronLeft,
    ChevronRight,
  } from "lucide-react";

  import { Id } from "@/convex/_generated/dataModel";
  import { useCart } from "@/app/context/CartContext";
  import { ProductSelector } from "../_components/ProductSelector";

  export interface ProductColor {
    name: string;
    hex: string;
  }

  export interface ProductImage {
    url: string;
    alt?: string;
    position?: number;
  }

  export interface Product {
    _id: Id<"products">;
    _creationTime: number;
    name: string;
    slug: string;
    description: string;
    sizes: string[];
    colors: ProductColor[];
    images: ProductImage[];
    isActive?: boolean;
    isFastSelling?: boolean;
    isOnSale?: boolean;
    isNewArrival?: boolean;
    isLimitedEdition?: boolean;
    showPrice: number;
    realPrice: number;
    taxRate?: number;
    categoryId?: Id<"categories">;
    collectionIds?: Id<"collections">[];
  }

  export default function ProductPage() {
    const { slug } = useParams<{ slug: string }>();
    const product = useQuery(api.viewProducts.getBySlug, { slug });

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // initialize selected size (first size)
    useEffect(() => {
      if (product && !selectedSize && product.sizes?.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }, [product, selectedSize]);

    // initialize selected color only once
    useEffect(() => {
      if (product && !selectedColor && product.colors?.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }, [product, selectedColor]);

    // handle loading
    if (product === undefined) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!product) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Product not found
            </h2>
            <p className="text-gray-600">
              The product you're looking for doesn't exist.
            </p>
          </div>
        </div>
      );
    }

    // discount + savings (based on realPrice vs showPrice)
    const discount =
      product.realPrice > product.showPrice
        ? Math.round(
            ((product.realPrice - product.showPrice) / product.realPrice) * 100
          )
        : null;


    // badge helper
    const getBadgeIcon = (type: "fast-selling" | "limited" | "new") => {
      switch (type) {
        case "fast-selling":
          return <Zap className="w-3 h-3" />;
        case "limited":
          return <Clock className="w-3 h-3" />;
        case "new":
          return <Sparkles className="w-3 h-3" />;
        default:
          return null;
      }
    };

    const nextImage = () => {
      if (product.images?.length > 1) {
        setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
      }
    };

    const prevImage = () => {
      if (product.images?.length > 1) {
        setSelectedImageIndex(
          (prev) => (prev - 1 + product.images.length) % product.images.length
        );
      }
    };
    return (
      <div className="min-h-screen max-w-7xl mx-auto my-14">
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6">
            <span className="hover:text-gray-900 cursor-pointer">Home</span> /
            <span className="hover:text-gray-900 cursor-pointer"> Product</span> /
            <span className="text-gray-900"> {product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src={
                    product.images?.[selectedImageIndex]?.url ||
                    "/placeholder.png"
                  }
                  alt={product.images?.[selectedImageIndex]?.alt || product.name}
                  fill
                  className="object-cover"
                />

                {/* Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {Boolean(product.isOnSale && discount) && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                      -{discount}% OFF
                    </Badge>
                  )}
                  {Boolean(product.isNewArrival) && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg flex items-center gap-1">
                      {getBadgeIcon("new")}
                      New
                    </Badge>
                  )}
                  {Boolean(product.isFastSelling) && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg flex items-center gap-1">
                      {getBadgeIcon("fast-selling")}
                      Hot
                    </Badge>
                  )}
                  {Boolean(product.isLimitedEdition) && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg flex items-center gap-1">
                      {getBadgeIcon("limited")}
                      Limited
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-blue-500 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || `${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Selector with AddToCart */}
              <ProductSelector product={product} />

              {/* Payment & Delivery Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold mb-4">Payment & Delivery</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Truck className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Free Delivery</div>
                      <div className="text-xs text-gray-600">on all orders</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-semibold text-sm">Payment Options</div>
                      <div className="text-xs text-gray-600">COD, Razorpay</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <RotateCcw className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-semibold text-sm">Easy Returns</div>
                      <div className="text-xs text-gray-600">7-day return</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    Available Payment Methods:
                  </h4>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      💰 Cash on Delivery
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      💳 Credit/Debit Card
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      🏦 Net Banking
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      📱 UPI
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Important Information
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Exchange facility is currently not available</li>
                  <li>• Returns accepted within 7 days of delivery</li>
                  <li>• COD available for orders under ₹50,000</li>
                  <li>• Free shipping on all orders</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
