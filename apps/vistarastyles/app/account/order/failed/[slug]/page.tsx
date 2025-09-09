// apps/vistarastyles/app/account/order/failed/[slug]/page.tsx
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
  XCircle,
  Package,
  AlertTriangle,
  MapPin,
  CreditCard,
  Mail,
  RefreshCw,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const OrderPaymentFailedPage: React.FC = () => {
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
  const addresses = useQuery(
    api.addresses.getAddresses,
    user ? { authId: user.id } : "skip"
  );

  if (!order) {
    // still loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  // order shape from your convex schema
  const {
    items = [],
    subtotal = 0,
    discount = 0,
    total = 0,
    paymentMethod = "cod",
    paymentStatus = "failed",
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

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Payment Failed - Order ${orderNumber}`);
    const body = encodeURIComponent(
      `Hi,\n\nI'm having trouble with payment for my order:\n\nOrder#: ${orderNumber}\nDate: ${orderDate}\nTotal: ₹${total}\nPayment Method: ${paymentMethod}\n${razorpayPaymentId ? `Razorpay Payment ID: ${razorpayPaymentId}\n` : ""}${razorpayOrderId ? `Razorpay Order ID: ${razorpayOrderId}\n` : ""}\nPlease help me complete this payment.\n\nThank you!`
    );
    window.location.href = `mailto:contacus@vistarastyles.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Failed Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-600 mt-2">
            We couldn't process your payment. Don't worry, you can try again.
          </p>
          <Badge variant="destructive" className="mt-3">
            Order #{orderNumber}
          </Badge>

          <div className="mt-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <span className="text-red-600 font-medium">Payment Failed</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </span>
          </div>
        </div>

        {/* Error Notice */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-900 mb-1">
                  What happened?
                </h3>
                <p className="text-sm text-red-800 mb-3">
                  Your payment couldn't be processed. This could be due to
                  insufficient funds, network issues, or card restrictions. Your
                  order is saved and no money has been charged.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleContactSupport}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleContactSupport}
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order Date</span>
                    <span className="text-sm text-gray-600">{orderDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment Status</span>
                    <Badge variant="destructive">Failed</Badge>
                  </div>
                  {razorpayPaymentId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Payment ID</span>
                      <span className="text-sm text-gray-600 font-mono">
                        {razorpayPaymentId}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="text-gray-600">Order Created</span>
                      <span className="text-gray-500 text-xs">Saved</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-medium text-red-600">
                        Payment Failed
                      </span>
                      <span className="text-gray-500 text-xs">Just now</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100">
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="text-gray-600">Awaiting Payment</span>
                      <span className="text-gray-500 text-xs">Pending</span>
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
                    ) : razorpayOrderId ? (
                      <div>
                        Razorpay Payment
                        <div className="text-xs text-gray-500">
                          Order id: {razorpayOrderId}
                        </div>
                        {razorpayPaymentId && (
                          <div className="text-xs text-red-500">
                            Payment failed: {razorpayPaymentId}
                          </div>
                        )}
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

                {/* Payment Notice */}
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-800">
                      <p className="font-bold">Payment Failed</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => router.push("/shop")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentFailedPage;
