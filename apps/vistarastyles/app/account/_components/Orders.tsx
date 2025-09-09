"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Progress } from "@radix-ui/react-progress";
import { useQuery } from "convex/react";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  IndianRupee,
  Package,
  Package2,
  ShoppingBag,
  Truck,
} from "lucide-react";
import React from "react";

export default function Orders() {
  const { user } = useUser();

  const orders = useQuery(api.orders.getOrders, {
    authId: user?.id || "",
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "placed":
        return <Package2 className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "placed":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="shadow-sm border-0 bg-white rounded-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-primary" />
              </div>
              Order History
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Track your orders and view past purchases
            </CardDescription>
          </div>
          <Button variant="outline" className="gap-2">
            <ShoppingBag size={16} />
            Continue Shopping
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {orders === undefined ? (
          <div className="text-center py-16">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 h-24 rounded-xl"></div>
              ))}
            </div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <Card
                key={order._id}
                className="border-l-4 border-l-primary/30 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 rounded-xl overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-xl text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <div
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(order._creationTime).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4" />
                          <span>{order.items?.length || 0} items</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left lg:text-right">
                      <div className="flex items-center space-x-1 text-3xl font-bold text-gray-900 mb-1">
                        <IndianRupee className="h-6 w-6" />
                        <span>{order.total.toFixed(2)}</span>
                      </div>
                      <Progress
                        value={
                          order.status === "delivered"
                            ? 100
                            : order.status === "shipped"
                              ? 66
                              : 33
                        }
                        className="w-24 lg:w-32 h-2"
                      />
                    </div>
                  </div>

                  {/* Enhanced Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t bg-gray-50 -mx-6 px-6 py-4 mt-6">
                      <div className="flex flex-wrap items-center gap-4">
                        {order.items
                          .slice(0, 4)
                          .map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-3 bg-white rounded-lg p-3 border"
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package2 className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.size && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {item.size}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    Qty: {item.quantity || 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        {order.items.length > 4 && (
                          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg border">
                            <span className="text-sm font-medium text-gray-600">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-16 w-16 text-primary/60" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your shopping journey and discover amazing products tailored
              just for you
            </p>
            <Button className="px-8 py-3 text-base">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
