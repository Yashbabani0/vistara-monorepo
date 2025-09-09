"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: { url: string; alt?: string; position?: number }[];
    colors: { hex: string; name: string }[];
    sizes: string[];
    showPrice: number;
    realPrice: number;
    isActive?: boolean;
    isFastSelling?: boolean;
    isLimitedEdition?: boolean;
    isNewArrival?: boolean;
    isOnSale?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    name,
    slug,
    showPrice,
    realPrice,
    images,
    colors,
    sizes,
    isFastSelling,
    isLimitedEdition,
    isNewArrival,
    isOnSale,
  } = product;

  const discount =
    showPrice > realPrice
      ? Math.round(((showPrice - realPrice) / showPrice) * 100)
      : null;

  function getImageKitUrl(url: string, width: number, height?: number) {
    if (!url) return "/placeholder.png";
    const params = [`w-${width}`, `q-90`, `f-auto`];
    if (height) params.push(`h-${height}`);
    return `${url}?tr=${params.join(",")},c-maintain_ratio`;
  }

  const imageUrl =
    images && images.length > 0 && images[currentImageIndex]?.url
      ? getImageKitUrl(images[currentImageIndex].url, 384)
      : "/placeholder.png";

  const getBadgeIcon = (type: string) => {
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

  const handleColorChange = (color: any) => {
    setSelectedColor(color);
    // Find image that matches this color if available
    const colorImageIndex = images.findIndex((img) =>
      img.alt?.toLowerCase().includes(color.name.toLowerCase())
    );
    if (colorImageIndex !== -1) {
      setCurrentImageIndex(colorImageIndex);
    }
  };

  return (
    <div className="group relative w-80 sm:w-[22em] h-fit">
      <Card className="overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white cursor-pointer py-0 pb-8">
        {/* Image Section with Enhanced Interactions */}
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Link href={`/product/${slug}`}>
            <Image
              src={imageUrl}
              alt={images?.[currentImageIndex]?.alt || name || "T-shirt"}
              width={384} // matches the request
              height={480} // optional, helps layout
              className="object-cover min-h-full max-h-full transition-all duration-700 group-hover:scale-110"
              priority
            />
          </Link>

          {/* Gradient Overlay for Better Badge Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/10 pointer-events-none" />

          {/* Enhanced Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {isOnSale && discount && (
              <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl backdrop-blur-sm border border-white/20 font-semibold">
                -{discount}% OFF
              </Badge>
            )}
            {isNewArrival && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl backdrop-blur-sm border border-white/20 flex items-center gap-1 font-semibold">
                {getBadgeIcon("new")}
                New
              </Badge>
            )}
            {isFastSelling && (
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xl backdrop-blur-sm border border-white/20 flex items-center gap-1 font-semibold animate-pulse">
                {getBadgeIcon("fast-selling")}
                Hot
              </Badge>
            )}
            {isLimitedEdition && (
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl backdrop-blur-sm border border-white/20 flex items-center gap-1 font-semibold">
                {getBadgeIcon("limited")}
                Limited
              </Badge>
            )}
          </div>

          {/* Image Dots for Multiple Images */}
          {images && images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-white shadow-lg scale-125"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="flex flex-col gap-2">
          {/* Product Name */}
          <Link href={`/product/${slug}`}>
            <h3 className="font-bold text-2xl capitalize text-gray-900 hover:text-yellow-500 transition-colors cursor-pointer">
              {name}
            </h3>
          </Link>

          {/* Price Section with Enhanced Styling */}
          <Link
            href={`/product/${slug}`}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                ₹{realPrice.toLocaleString()}
              </span>
              {realPrice !== showPrice && (
                <span className="text-sm line-through text-gray-400 font-medium">
                  ₹{showPrice.toLocaleString()}
                </span>
              )}
            </div>
            {discount && (
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 font-semibold">
                  Save ₹{(showPrice - realPrice).toLocaleString()}
                </Badge>
              </div>
            )}
          </Link>

          {/* Enhanced Colors Section */}
          {colors && colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Color:
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {selectedColor?.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 `}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleColorChange(color);
                    }}
                  >
                    {selectedColor?.hex === color.hex && (
                      <div className="absolute inset-[1px] rounded-full border-2 border-white shadow-sm" />
                    )}
                  </button>
                ))}
                {colors.length > 5 && (
                  <span className="text-xs text-gray-500 ml-2">
                    +{colors.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Sizes Section */}
          {sizes && sizes.length > 0 && (
            <Link href={`/product/${slug}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Size:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <p
                    key={s}
                    className="text-sm cursor-pointer hover:bg-yellow-50 hover:text-yellow-500 transition-colors duration-200 ease-in-out text-gray-700 border p-2 hover:border-amber-200 w-12 text-center rounded-md font-semibold"
                  >
                    {s}
                  </p>
                ))}
              </div>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
