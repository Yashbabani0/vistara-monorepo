// app/dashboard/products/add/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  UploadResponse,
} from "@imagekit/next";
import { toast } from "sonner";
import {
  Upload,
  X,
  Package,
  Palette,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Info,
  CheckCircle,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

interface Color {
  name: string;
  hex: string;
}

export default function Page() {
  const [productName, setProductName] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: number;
  }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [size, setSize] = useState("");
  const [colors, setColors] = useState<Color[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = useQuery(api.categories.getCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const collections = useQuery(api.collections.getCollections);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [showPrice, setShowPrice] = useState<number | string>();
  const [realPrice, setRealPrice] = useState<number | string>();
  const [flags, setFlags] = useState({
    isActive: false,
    isFastSelling: false,
    isOnSale: false,
    isNewArrival: false,
    isLimitedEdition: false,
  });
  const createProduct = useMutation(api.createProduct.createProduct);

  // Authentication function for ImageKit
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  // File handling
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) => file.type === "image/webp"
    );

    if (newFiles.length !== files.length) {
      toast.error("Only .webp images are allowed!");
    }

    const updatedFiles = [...images, ...newFiles];
    setImages(updatedFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Upload single image to ImageKit
  const uploadSingleImage = async (
    file: File,
    index: number
  ): Promise<string> => {
    try {
      const authParams = await authenticator();
      const { signature, expire, token, publicKey } = authParams;

      if (!signature || !expire || !token || !publicKey) {
        throw new Error("Missing authentication parameters");
      }

      if (!file) {
        throw new Error("No file selected");
      }

      console.log("Uploading file:", file.name);
      console.log("Authentication parameters:", authParams);

      const uploadResponse: UploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: "/products",
        useUniqueFileName: true,
        onProgress: (event) => {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [index]: progress,
          }));
        },
      });

      if (!uploadResponse.url) {
        throw new Error("Upload did not return a URL");
      }

      return uploadResponse.url;
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);

      if (error instanceof ImageKitAbortError) {
        throw new Error(`Upload aborted: ${error.reason}`);
      } else if (error instanceof ImageKitInvalidRequestError) {
        throw new Error(`Invalid request: ${error.message}`);
      } else if (error instanceof ImageKitUploadNetworkError) {
        throw new Error(`Network error: ${error.message}`);
      } else if (error instanceof ImageKitServerError) {
        throw new Error(`Server error: ${error.message}`);
      } else {
        throw new Error(`Upload failed: ${error}`);
      }
    }
  };

  // Upload all images
  const handleImageUpload = async () => {
    if (images.length === 0) {
      toast.error("Please select images to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress({});

    try {
      const uploadPromises = images.map((file, index) =>
        uploadSingleImage(file, index)
      );

      const urls = await Promise.all(uploadPromises);
      setUploadedUrls(urls);

      // Clear the progress after successful upload
      setUploadProgress({});

      toast.success("All images uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Slug function
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // replace spaces & symbols with -
      .replace(/^-+|-+$/g, ""); // trim - from start & end

  useEffect(() => {
    if (productName) {
      setProductSlug(slugify(productName));
    } else {
      setProductSlug("");
    }
  }, [productName]);

  // Colors
  const addColor = () => {
    if (!colorName.trim()) {
      toast.error("Please enter a color name.");
      return;
    }
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(colorHex);
    if (!isValidHex) {
      toast.error("Enter a valid hex code (e.g., #000000 or #FFF)");
      return;
    }
    setColors((prev) => [...prev, { name: colorName.trim(), hex: colorHex }]);
    setColorName("");
    setColorHex("");
  };

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  // Collections
  const toggleCollection = (id: string) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Flags
  const toggleFlag = (key: keyof typeof flags) => {
    setFlags((prev) => {
      const currentlyActive = Object.values(prev).filter(Boolean).length;
      if (!prev[key] && currentlyActive >= 3) {
        toast.error("You can only select up to 3 flags at a time.");
        return prev;
      }
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const clearForm = () => {
    setProductName("");
    setProductSlug("");
    setProductDescription("");
    // revoke and clear file input + previews
    previewUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImages([]);
    setPreviewUrls([]);
    setUploadedUrls([]);

    setSize("");
    setColors([]);
    setSelectedCategory("");
    setSelectedCollections([]);
    setShowPrice("");
    setRealPrice("");
    setFlags({
      isActive: false,
      isFastSelling: false,
      isOnSale: false,
      isNewArrival: false,
      isLimitedEdition: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Ensure images are uploaded to ImageKit first
      if (uploadedUrls.length === 0 && images.length > 0) {
        // Upload first if user hasn't clicked "Upload Images"
        await handleImageUpload();
      }

      // Simple validation
      if (!productName.trim()) {
        toast.error("Please enter a product name.");
        return;
      }
      if (!productSlug.trim()) {
        toast.error("Please enter a product slug.");
        return;
      }
      if (!uploadedUrls.length) {
        toast.error("Please upload at least one product image.");
        return;
      }

      const productPayload = {
        name: productName.trim(),
        slug: productSlug.trim(),
        description: productDescription.trim(),
        images: uploadedUrls, // array of ImageKit public URLs (string[])
        size: size || null,
        colors, // Color[] e.g., [{name, hex}, ...]
        category: selectedCategory,
        collections: selectedCollections,
        price: showPrice ?? null,
        salePrice: realPrice ?? null,
        flags,
      };

      // Call Convex mutation to create the product record
      const insertedId = await createProduct({ product: productPayload });
      console.log("Created product ID:", insertedId);

      toast.success("Product created successfully.");

      clearForm();
    } catch (err) {
      console.error("Failed to create product:", err);
      toast.error(`Failed to add product: ${err}`);
    }
  };

  const flagLabels = {
    isActive: "Active",
    isFastSelling: "Fast Selling",
    isOnSale: "On Sale",
    isNewArrival: "New Arrival",
    isLimitedEdition: "Limited Edition",
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 mt-20 mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Product
            </h1>
          </div>
          <p className="text-gray-600">
            Create a new product with detailed information, images, and pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="productName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Product Name *
                      </Label>
                      <Input
                        type="text"
                        id="productName"
                        placeholder="Enter product name"
                        maxLength={100}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="productSlug"
                        className="text-sm font-medium text-gray-700"
                      >
                        Product Slug *
                      </Label>
                      <Input
                        type="text"
                        id="productSlug"
                        placeholder="product-url-slug"
                        maxLength={100}
                        value={productSlug}
                        readOnly
                        className="h-11 bg-gray-100 cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="productDescription"
                      className="text-sm font-medium text-gray-700"
                    >
                      Product Description *
                    </Label>
                    <Textarea
                      id="productDescription"
                      placeholder="Describe your product in detail..."
                      maxLength={500}
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="min-h-[120px] resize-none"
                      required
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {productDescription.length}/500 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="productSize"
                      className="text-sm font-medium text-gray-700"
                    >
                      Size Options
                    </Label>
                    <Input
                      type="text"
                      id="productSize"
                      placeholder="S, M, L, XL or One Size"
                      maxLength={50}
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Images Card */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="w-5 h-5 text-green-600" />
                    Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">
                        Upload Images (.webp only) *
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {uploadedUrls.length} uploaded
                      </Badge>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/webp"
                        multiple
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                      />
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Choose files
                          </button>
                          <p className="text-sm text-gray-500 mt-1">
                            or drag and drop WebP images here
                          </p>
                        </div>
                      </div>
                    </div>

                    {images.length > 0 && (
                      <Button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                      >
                        {isUploading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Uploading...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Images ({images.length})
                          </div>
                        )}
                      </Button>
                    )}

                    {/* Upload Progress */}
                    {isUploading && Object.keys(uploadProgress).length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Upload Progress
                        </h4>
                        {Object.entries(uploadProgress).map(
                          ([index, progress]) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Image {parseInt(index) + 1}
                                </span>
                                <span className="text-gray-900 font-medium">
                                  {Math.round(progress)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Image Previews */}
                    {(previewUrls.length > 0 || uploadedUrls.length > 0) && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          {uploadedUrls.length > 0 ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Uploaded Images
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                              Preview (Not Uploaded)
                            </>
                          )}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {(uploadedUrls.length > 0
                            ? uploadedUrls
                            : previewUrls
                          ).map((url, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={url}
                                alt={`Product ${idx + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              {uploadedUrls.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeUploadedImage(idx)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Colors Card */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Palette className="w-5 h-5 text-purple-600" />
                    Product Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Color name (e.g., Midnight Black)"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      className="flex-1 h-11"
                    />
                    <Input
                      type="text"
                      placeholder="#000000"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-32 h-11"
                    />
                    <Button
                      type="button"
                      onClick={addColor}
                      className="h-11 px-6"
                    >
                      Add
                    </Button>
                  </div>

                  {colors.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Added Colors ({colors.length})
                      </h4>
                      <div className="grid gap-3">
                        {colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50/50"
                          >
                            <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 capitalize">
                                {color.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {color.hex}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeColor(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Categories, Pricing, etc. */}
            <div className="space-y-6">
              {/* Category & Collections Card */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="w-5 h-5 text-orange-600" />
                    Categories & Collections
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Product Category *
                    </Label>
                    <Select
                      onValueChange={(value) => setSelectedCategory(value)}
                      value={selectedCategory ?? undefined}
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {categories?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Collections ({selectedCollections.length} selected)
                    </Label>
                    <div className="max-h-48 overflow-y-auto border rounded-lg">
                      {collections?.map((collection) => (
                        <div
                          key={collection._id}
                          className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            id={`collection-${collection._id}`}
                            checked={selectedCollections.includes(
                              collection._id
                            )}
                            onChange={() => toggleCollection(collection._id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`collection-${collection._id}`}
                            className="ml-3 text-sm text-gray-700 flex-1 cursor-pointer"
                          >
                            {collection.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Card */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="productPrice"
                      className="text-sm font-medium text-gray-700"
                    >
                      Regular Price *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <Input
                        type="number"
                        id="productPrice"
                        placeholder="0.00"
                        value={showPrice}
                        onChange={(e) => setShowPrice(e.target.value)}
                        onBlur={() => {
                          if (
                            showPrice !== undefined &&
                            !isNaN(Number(showPrice))
                          ) {
                            setShowPrice(
                              parseFloat(Number(showPrice).toFixed(2))
                            );
                          }
                        }}
                        className="pl-8 h-11"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="productDiscountedPrice"
                      className="text-sm font-medium text-gray-700"
                    >
                      Sale Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <Input
                        type="number"
                        id="productDiscountedPrice"
                        placeholder="0.00"
                        value={realPrice}
                        onChange={(e) => setRealPrice(e.target.value)}
                        onBlur={() => {
                          if (
                            realPrice !== undefined &&
                            !isNaN(Number(realPrice))
                          ) {
                            setRealPrice(
                              parseFloat(Number(realPrice).toFixed(2))
                            );
                          }
                        }}
                        className="pl-8 h-11"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Flags Card */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-indigo-600" />
                      Product Flags
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Object.values(flags).filter(Boolean).length}/3 selected
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Select up to 3 flags to highlight special product
                      attributes.
                    </p>
                    {Object.keys(flags).map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Label
                          htmlFor={`flag-${key}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {flagLabels[key as keyof typeof flagLabels]}
                        </Label>
                        <input
                          type="checkbox"
                          id={`flag-${key}`}
                          checked={flags[key as keyof typeof flags]}
                          onChange={() => toggleFlag(key as keyof typeof flags)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              className="h-12 px-8"
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              disabled={uploadedUrls.length === 0}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Add Product
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
