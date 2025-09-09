// apps/vistarastyles/app/checkout/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CreditCard,
  Lock,
  MapPin,
  Mail,
  Trash2,
  Plus,
  Minus,
  Banknote,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  line3: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode required"),
  paymentMethod: z.enum(["cod", "razorpay"]).refine((v) => !!v, {
    message: "Please select a payment method",
  }),
});

const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(10),
  line1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(6),
  line2: z.string().optional(),
  line3: z.string().optional(),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type FormData = z.infer<typeof checkoutSchema>;

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();

  // Convex mutations & queries
  const addAddress = useMutation(api.addresses.addAddress);
  const removeAddress = useMutation(api.addresses.deleteAddress);
  const markPaymentFailed = useMutation(api.orders.markPaymentFailed);
  const startCheckout = useMutation(api.orders.startCheckout);

  // UI state
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    line3: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // flag to avoid double-handling the payment (important for ondismiss race)
  const paymentHandledRef = useRef(false);

  // Get user from DB
  const dbUser = useQuery(
    api.users.getByAuthId,
    user ? { authId: user.id } : "skip"
  );

  // Cart data (from DB snapshot)
  const cartData = useQuery(
    api.cartFunc.getByUser,
    dbUser ? { userId: dbUser._id } : "skip"
  );

  // User addresses
  const addresses = useQuery(
    api.addresses.getAddresses,
    user ? { authId: user.id } : "skip"
  );

  const [selectedAddressId, setSelectedAddressId] =
    useState<Id<"addresses"> | null>(addresses?.[0]?._id || null);

  // Prefill default address when available
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddress) {
        setFormData((prev) => ({
          ...prev,
          firstName:
            prev.firstName || defaultAddress.fullName.split(" ")[0] || "",
          lastName:
            prev.lastName || (defaultAddress.fullName.split(" ")[1] ?? ""),
          phone: prev.phone || defaultAddress.phone,
          line1: prev.line1 || defaultAddress.line1,
          line2: prev.line2 || defaultAddress.line2,
          line3: prev.line3 || defaultAddress.line3,
          landmark: prev.landmark || defaultAddress.landmark,
          city: prev.city || defaultAddress.city,
          state: prev.state || defaultAddress.state,
          pincode: prev.pincode || defaultAddress.pincode,
        }));
        setSelectedAddressId(defaultAddress._id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  // Local form data
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    line1: "",
    line2: "",
    line3: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.emailAddresses[0]?.emailAddress || "",
        firstName: prev.firstName || user.firstName || "",
        lastName: prev.lastName || user.lastName || "",
        phone: prev.phone || (user.primaryPhoneNumber?.phoneNumber ?? ""),
      }));
    }
  }, [user]);

  const cartItems = cartData?.items || [];

  const updateCartItemQty = useMutation(api.cartFunc.updateCartItemQty);
  const removeCartItem = useMutation(api.cartFunc.removeCartItem);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      await updateCartItemQty({
        cartItemId: cartItemId as any,
        quantity: newQuantity,
      });
    } catch (err) {
      console.error("Error updating qty", err);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await removeCartItem({ cartItemId: cartItemId as any });
    } catch (err) {
      console.error("Error removing item", err);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.realPrice * item.quantity,
    0
  );
  const slabDiscount = Math.floor(subtotal / 1000) * 50;
  const appliedDiscount =
    formData.paymentMethod === "razorpay" ? slabDiscount : 0;
  const total = Math.max(subtotal - appliedDiscount, 0);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    try {
      checkoutSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path && issue.path[0])
            newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit invoked — form data:", formData);

    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }
    if (!selectedAddressId) {
      alert("Please select a shipping address");
      return;
    }

    setIsProcessing(true);
    paymentHandledRef.current = false; // reset flag for this attempt

    try {
      // --- 1) Create Convex order snapshot (server-side)
      console.log("Calling startCheckout (Convex)...");
      const startResp = await startCheckout({
        authId: user!.id,
        addressId: selectedAddressId!,
        paymentMethod: formData.paymentMethod,
      });
      const orderIdStr = String(startResp.orderId);
      console.log("startCheckout response:", startResp);

      if (!startResp || !startResp.orderId) {
        throw new Error(
          "Invalid startCheckout response: " + JSON.stringify(startResp)
        );
      }

      // COD short-circuit
      if (formData.paymentMethod === "cod") {
        console.log("COD selected — redirecting to success");
        router.push(`/account/order/success/${orderIdStr}`);
        return;
      }

      // --- 2) Create Razorpay order via Next API
      console.log("Creating Razorpay order via Next API...");
      const createResp = await fetch("/api/razorpay/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(startResp.total * 100),
          currency: "INR",
          receipt: startResp.orderId,
        }),
      });

      let createBodyText = "";
      try {
        createBodyText = await createResp.text();
        console.log(
          "create-razorpay-order status:",
          createResp.status,
          "body:",
          createBodyText
        );
      } catch (err) {
        console.warn("Failed to read createResp body text:", err);
      }

      if (!createResp.ok) {
        let parsed;
        try {
          parsed = JSON.parse(createBodyText);
        } catch {
          parsed = createBodyText;
        }
        throw new Error(
          "Failed to create razorpay order: " + JSON.stringify(parsed)
        );
      }

      const razorpayOrder = JSON.parse(createBodyText);
      console.log("razorpayOrder:", razorpayOrder);

      // --- 3) Load Razorpay script
      console.log("Loading Razorpay script...");
      const loaded = await loadRazorpayScript();
      console.log(
        "Razorpay script loaded?",
        loaded,
        "window.Razorpay:",
        !!(window as any).Razorpay
      );
      if (!loaded || !(window as any).Razorpay) {
        throw new Error(
          "Razorpay script failed to load or Razorpay is not available on window"
        );
      }

      // --- 4) Build Razorpay options (set ondismiss here BEFORE constructing)
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Vistara Styles",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          console.log("Razorpay handler called with response:", response);

          // If we've already processed the payment, don't do it again
          if (paymentHandledRef.current) {
            console.log("Payment already handled; ignoring handler.");
            setIsProcessing(false);
            return;
          }
          paymentHandledRef.current = true;

          try {
            const verify = await fetch(
              "/api/razorpay/verify-razorpay-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: startResp.orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
            console.log("verify response status:", verify.status);
            if (verify.ok) {
              console.log("Payment verified — redirecting to success");
              router.push(`/account/order/success/${orderIdStr}`);
            } else {
              console.warn("Payment verification failed (handler)");
              try {
                // best-effort mark failed (only send orderId to match your mutation)
                await markPaymentFailed({
                  orderId: startResp.orderId as any,
                } as any);
              } catch (e) {
                console.error("markPaymentFailed error:", e);
              }
              router.push(`/account/order/failed/${orderIdStr}`);
            }
          } catch (err) {
            console.error("Error while verifying payment:", err);
            try {
              await markPaymentFailed({
                orderId: startResp.orderId as any,
              } as any);
            } catch (e) {
              console.error("markPaymentFailed error:", e);
            }
            router.push(`/account/order/failed/${orderIdStr}`);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          // set ondismiss here (Razorpay will pick this up from options passed to constructor)
          ondismiss: async () => {
            console.log("Razorpay modal ondismiss fired (options handler)");
            // If payment already handled (success or already-processed failure), do nothing
            if (paymentHandledRef.current) {
              console.log(
                "Payment already handled; ondismiss will not mark failed or navigate."
              );
              setIsProcessing(false);
              return;
            }

            // Otherwise, user closed the modal without completing a successful payment.
            // This is where we mark the order failed so backend state matches UX.
            paymentHandledRef.current = true;
            try {
              await markPaymentFailed({
                orderId: startResp.orderId as any,
              } as any);
            } catch (err) {
              console.error("Error marking failed on ondismiss:", err);
            } finally {
              setIsProcessing(false);
              router.push(`/account/order/failed/${orderIdStr}`);
            }
          },
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
      };

      try {
        // instantiate with options that already include ondismiss
        const rzp = new (window as any).Razorpay(options);

        // attach payment.failed listener — keep for logging / user messaging only,
        // but don't mark order failed here so user can retry inside the modal.
        if (rzp && typeof rzp.on === "function") {
          rzp.on("payment.failed", async (resp: any) => {
            console.warn("Razorpay payment.failed event:", resp);
            // DON'T call markPaymentFailed here — user may retry in same modal.
            // Optionally show a toast/modal to the user if you want to surface the failure.
            // We simply log it and leave final decision to ondismiss or successful handler.
          });
        }

        rzp.open();
        console.log("Razorpay modal opened");
      } catch (err) {
        console.error("Failed to open Razorpay modal:", err);
        setIsProcessing(false);
        throw err;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert((err as Error).message || "Checkout failed");
      setIsProcessing(false);
    }
  };

  if (!cartData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email" className="mb-2">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="mb-2">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="mb-2">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="mb-2">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            {addresses && addresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Saved Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {addr.fullName}{" "}
                            {addr.isDefault && (
                              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">{addr.phone}</p>
                          <p className="text-sm text-gray-700">
                            {addr.line1}
                            {addr.line2 && `, ${addr.line2}`}
                            {addr.line3 && `, ${addr.line3}`}
                            {addr.landmark && `, Near ${addr.landmark}`}
                          </p>
                          <p className="text-sm text-gray-700">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant={
                              selectedAddressId === addr._id
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                firstName: addr.fullName.split(" ")[0] || "",
                                lastName: addr.fullName.split(" ")[1] ?? "",
                                phone: addr.phone,
                                line1: addr.line1,
                                line2: addr.line2,
                                line3: addr.line3,
                                landmark: addr.landmark,
                                city: addr.city,
                                state: addr.state,
                                pincode: addr.pincode,
                              }));
                              setSelectedAddressId(addr._id);
                            }}
                          >
                            {selectedAddressId === addr._id
                              ? "Selected"
                              : "Use"}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={async () =>
                              await removeAddress({ addressId: addr._id })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => setShowNewAddress(true)}
              variant="outline"
              className="w-full"
            >
              + Add New Address
            </Button>

            <Dialog open={showNewAddress} onOpenChange={setShowNewAddress}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const parsed = addressSchema.parse(newAddress);
                      await addAddress({ authId: user!.id, ...parsed });
                      setShowNewAddress(false);
                      setNewAddress({
                        fullName: "",
                        phone: "",
                        line1: "",
                        line2: "",
                        line3: "",
                        landmark: "",
                        city: "",
                        state: "",
                        pincode: "",
                        isDefault: false,
                      });
                    } catch (err) {
                      if (err instanceof z.ZodError) {
                        const errs: Record<string, string> = {};
                        err.issues.forEach((i) => {
                          if (i.path[0]) errs[i.path[0] as string] = i.message;
                        });
                        setAddressErrors(errs);
                      } else {
                        console.error(err);
                      }
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="mb-2">Full Name *</Label>
                    <Input
                      value={newAddress.fullName}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className={addressErrors.fullName ? "border-red-500" : ""}
                    />
                    {addressErrors.fullName && (
                      <p className="text-red-500 text-sm">
                        {addressErrors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2">Phone *</Label>
                    <Input
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className={addressErrors.phone ? "border-red-500" : ""}
                    />
                    {addressErrors.phone && (
                      <p className="text-red-500 text-sm">
                        {addressErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2">Address Line 1 *</Label>
                    <Input
                      value={newAddress.line1}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          line1: e.target.value,
                        }))
                      }
                      className={addressErrors.line1 ? "border-red-500" : ""}
                    />
                    {addressErrors.line1 && (
                      <p className="text-red-500 text-sm">
                        {addressErrors.line1}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2">Address Line 2</Label>
                    <Input
                      value={newAddress.line2}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          line2: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-2">City *</Label>
                    <Input
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className={addressErrors.city ? "border-red-500" : ""}
                    />
                    {addressErrors.city && (
                      <p className="text-red-500 text-sm">
                        {addressErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2">State *</Label>
                    <Input
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className={addressErrors.state ? "border-red-500" : ""}
                    />
                    {addressErrors.state && (
                      <p className="text-red-500 text-sm">
                        {addressErrors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2">Pincode *</Label>
                    <Input
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          pincode: e.target.value,
                        }))
                      }
                      className={addressErrors.pincode ? "border-red-500" : ""}
                    />
                    {addressErrors.pincode && (
                      <p className="text-red-500 text-sm">
                        {addressErrors.pincode}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Save Address
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(v) =>
                    handleInputChange("paymentMethod", v as any)
                  }
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Banknote className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-500">
                          Pay when your order is delivered
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label
                      htmlFor="razorpay"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Razorpay</div>
                        <div className="text-sm text-gray-500">
                          Pay securely with card, UPI, or net banking
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.paymentMethod}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cartItems.length} items in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-3"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.productName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            ₹{item.realPrice.toFixed(2)}
                          </p>
                          {item.size && (
                            <p className="text-xs text-gray-400">
                              Size: {item.size}
                            </p>
                          )}
                          {item.color && (
                            <p className="text-xs text-gray-400">
                              Color: {item.color}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="h-8 w-8 p-0"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item._id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {formData.paymentMethod === "razorpay" && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Razorpay Discount</span>
                          <span>-₹{appliedDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>GST (5%)</span>
                        <span>included</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                        <MapPin className="h-4 w-4" />
                        Free shipping on all orders
                      </div>
                      <p className="text-xs text-gray-600">
                        Estimated delivery: 5-7 business days
                      </p>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full text-lg py-6 z-50 cursor-pointer"
                      size="lg"
                      disabled={isProcessing || cartItems.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          {formData.paymentMethod === "cod"
                            ? `Place Order - ₹${total.toFixed(2)}`
                            : `Pay Now - ₹${total.toFixed(2)}`}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By placing your order, you agree to our Terms of Service
                      and Privacy Policy
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
