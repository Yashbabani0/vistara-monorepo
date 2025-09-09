// apps/vistarastyles/app/account/order/success/[slug]/page.tsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Mail,
  Download,
  Lock,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const OrderConfirmationPage: React.FC = () => {
  const params = useParams() as { slug?: string };
  const router = useRouter();
  const { user } = useUser();
  const orderId = params?.slug ?? null;

  // fetch order by id (Convex)
  const order = useQuery(
    api.orders.getOrder,
    orderId ? { orderId: orderId as unknown as Id<"orders"> } : "skip"
  );

  // fetch user's addresses so we can display the order's shipping address
  // (we only need this to resolve addressId -> full address)
  const addresses = useQuery(
    api.addresses.getAddresses,
    user ? { authId: user.id } : "skip"
  );

  if (!order) {
    // still loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!order) return null;

  // order shape from your convex schema:
  // { userId, addressId, items, subtotal, discount?, total, paymentStatus, paymentMethod, razorpayOrderId?, razorpayPaymentId?, status, updatedAt }
  const {
    items = [],
    subtotal = 0,
    discount = 0,
    total = 0,
    paymentMethod = "cod",
    paymentStatus = "pending",
    razorpayPaymentId,
    razorpayOrderId,
    addressId,
    updatedAt,
  } = order as any;

  // find full address from addresses list (if available)
  const shippingAddress =
    addresses?.find((a: any) => String(a._id) === String(addressId)) ?? null;

  const orderNumber = String(order._id ?? orderId);
  const orderDate = updatedAt ? new Date(updatedAt).toLocaleString() : "—";
  const estimatedDelivery = (() => {
    if (!updatedAt) return "—";
    const d = new Date(updatedAt);
    d.setDate(d.getDate() + 5); // simple estimate: +5 days
    return d.toLocaleDateString();
  })();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Thank you — we received your order and are processing it now.
          </p>
          <Badge variant="secondary" className="mt-3">
            Order #{orderNumber}
          </Badge>

          <div className="mt-2 text-sm text-gray-500">
            {paymentStatus ? (
              <span className="inline-flex items-center gap-2">
                {paymentStatus === "paid" ? (
                  <>
                    <span className="text-green-600 font-medium">Paid</span>
                    <Lock className="h-4 w-4 text-green-600" />
                  </>
                ) : (
                  <span className="text-yellow-600 font-medium">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : paymentStatus}
                  </span>
                )}
              </span>
            ) : null}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              // simple download: build text receipt and open in new tab as blob
              const text = `Order #${orderNumber}\nDate: ${orderDate}\nTotal: ${total}\n\nItems:\n${items
                .map(
                  (it: any) =>
                    `${it.name} x${it.quantity} — ₹${(it.price * it.quantity).toFixed(2)}`
                )
                .join("\n")}`;
              const blob = new Blob([text], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank");
            }}
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              // open mailto with a summary
              const subject = encodeURIComponent(
                `Order ${orderNumber} confirmation`
              );
              const body = encodeURIComponent(
                `Thanks! Here are your order details:\n\nOrder#: ${orderNumber}\nDate: ${orderDate}\nTotal: ₹${total}\n\nItems:\n${items
                  .map(
                    (it: any) =>
                      `${it.name} x${it.quantity} — ₹${(it.price * it.quantity).toFixed(2)}`
                  )
                  .join("\n")}`
              );
              window.location.href = `mailto:${user?.emailAddresses?.[0]?.emailAddress ?? ""}?subject=${subject}&body=${body}`;
            }}
          >
            <Mail className="h-4 w-4" />
            Email Receipt
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push(`/account/order/${orderNumber}`)}
          >
            <Package className="h-4 w-4" />
            View Order
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order Date</span>
                    <span className="text-sm text-gray-600">{orderDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Estimated Delivery
                    </span>
                    <span className="text-sm text-gray-600">
                      {estimatedDelivery}
                    </span>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">Order Confirmed</span>
                      <span className="text-gray-500 text-xs">Just now</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="text-gray-600">Processing</span>
                      <span className="text-gray-500 text-xs">
                        1-2 business days
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100">
                        <Truck className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="text-gray-600">Shipped</span>
                      <span className="text-gray-500 text-xs">
                        3-4 business days
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shippingAddress ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{shippingAddress.fullName}</p>
                    <p>{shippingAddress.line1}</p>
                    {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                    <p>
                      {shippingAddress.city}, {shippingAddress.state}{" "}
                      {shippingAddress.pincode}
                    </p>
                    <p>{/* country not in schema maybe; omit */}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Phone: {shippingAddress.phone}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Shipping address not available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-fit px-2 bg-gray-100 rounded">
                    <span className="text-xs font-semibold">
                      {String(paymentMethod).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    {paymentMethod === "cod" ? (
                      <div>Cash on Delivery</div>
                    ) : razorpayPaymentId ? (
                      <div>
                        Paid via Razorpay
                        <div className="text-xs text-gray-500">
                          Payment id: {razorpayPaymentId}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        Payment status: {paymentStatus}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{items.length} items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <img
                        src={item.image ?? undefined}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{Number(subtotal).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>-₹{Number(discount ?? 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{Number(total).toFixed(2)}</span>
                  </div>
                </div>

                {/* Email Confirmation Notice */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">
                        Confirmation email sent
                      </p>
                      <p>
                        We've sent order details to your email address. Check
                        your inbox for tracking information.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Continue Shopping */}
                <Button
                  className="w-full bg-yellow-500 cursor-pointer hover:opacity-90 text-white"
                  onClick={() => router.push("/")}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
