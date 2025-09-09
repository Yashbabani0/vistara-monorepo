"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const ORDER_STATUS_OPTIONS = [
  "placed",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "canceled",
] as const;

const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "failed", "cod"] as const;
const PAYMENT_METHOD_OPTIONS = ["razorpay", "cod", "stripe"] as const;

// Status badge component
const StatusBadge = ({
  status,
  type = "order",
}: {
  status: string;
  type?: "order" | "payment";
}) => {
  const getStatusColor = (status: string, type: string) => {
    if (type === "payment") {
      switch (status.toLowerCase()) {
        case "paid":
          return "bg-green-100 text-green-800 border-green-200";
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "failed":
          return "bg-red-100 text-red-800 border-red-200";
        case "cod":
          return "bg-blue-100 text-blue-800 border-blue-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    } else {
      switch (status.toLowerCase()) {
        case "completed":
        case "delivered":
          return "bg-green-100 text-green-800 border-green-200";
        case "processing":
        case "shipped":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "pending":
        case "placed":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "cancelled":
        case "canceled":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status, type)}`}
    >
      {status}
    </span>
  );
};

export default function AdminOrdersPage() {
  // filters + pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    string | undefined
  >(undefined);
  const [search, setSearch] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // query
  const pageQuery = useQuery(api.orders.getOrdersPage, {
    page,
    pageSize,
    status: statusFilter,
    paymentStatus: paymentStatusFilter,
    search: search.trim() === "" ? undefined : search.trim(),
  });

  // mutations
  const mutateOrderStatus = useMutation(api.orders.updateOrderStatus);
  const mutatePaymentStatus = useMutation(api.orders.updateOrderPaymentStatus);
  const mutateOrder = useMutation(api.orders.updateOrder);

  // loading states
  const [loadingStatusMap, setLoadingStatusMap] = useState<
    Record<string, boolean>
  >({});
  const [loadingPaymentMap, setLoadingPaymentMap] = useState<
    Record<string, boolean>
  >({});
  const [savingFieldsMap, setSavingFieldsMap] = useState<
    Record<string, boolean>
  >({});

  // local edits for paymentMethod / razorpayPaymentId
  const [edits, setEdits] = useState<
    Record<string, { paymentMethod: string; razorpayPaymentId: string }>
  >({});

  // Derived
  const items = pageQuery?.items ?? [];
  const total = pageQuery?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [statusFilter, paymentStatusFilter, search, pageSize]);

  const formatCurrency = (n: number | undefined) =>
    typeof n === "number"
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(n)
      : "-";

  const formatDate = (ts: number | undefined) => {
    if (!ts) return "-";
    const asNumber = Number(ts);
    const maybeMs = asNumber < 10000000000 ? asNumber * 1000 : asNumber;
    return new Date(maybeMs).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  function onEditFieldChange(
    orderId: string,
    field: "paymentMethod" | "razorpayPaymentId",
    value: string
  ) {
    setEdits((s) => ({
      ...s,
      [orderId]: {
        paymentMethod:
          field === "paymentMethod" ? value : (s[orderId]?.paymentMethod ?? ""),
        razorpayPaymentId:
          field === "razorpayPaymentId"
            ? value
            : (s[orderId]?.razorpayPaymentId ?? ""),
      },
    }));
  }

  async function changeOrderStatus(orderId: string, newStatus: string) {
    const destructive = ["cancelled", "canceled"];
    if (destructive.includes(newStatus.toLowerCase())) {
      const ok = window.confirm(
        "Are you sure you want to cancel this order? This action is destructive."
      );
      if (!ok) return;
    }

    try {
      setLoadingStatusMap((m) => ({ ...m, [orderId]: true }));
      await mutateOrderStatus({ orderId, status: newStatus });
      toast.success("Order status updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Failed to update order status");
    } finally {
      setLoadingStatusMap((m) => ({ ...m, [orderId]: false }));
    }
  }

  async function changePaymentStatus(
    orderId: string,
    newPaymentStatus: string
  ) {
    try {
      setLoadingPaymentMap((m) => ({ ...m, [orderId]: true }));
      await mutatePaymentStatus({ orderId, paymentStatus: newPaymentStatus });
      toast.success("Payment status updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Failed to update payment status");
    } finally {
      setLoadingPaymentMap((m) => ({ ...m, [orderId]: false }));
    }
  }

  async function savePaymentFields(orderId: string) {
    const local = edits[orderId];
    if (!local) {
      toast.error("No changes to save");
      return;
    }
    const payload: any = { orderId };
    if (local.paymentMethod) payload.paymentMethod = local.paymentMethod;
    if (local.razorpayPaymentId)
      payload.razorpayPaymentId = local.razorpayPaymentId;

    if (Object.keys(payload).length === 1) {
      toast.error("No changes to save");
      return;
    }

    try {
      setSavingFieldsMap((m) => ({ ...m, [orderId]: true }));
      await mutateOrder(payload);
      toast.success("Order updated");
      setEdits((s) => {
        const copy = { ...s };
        delete copy[orderId];
        return copy;
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Failed to save fields");
    } finally {
      setSavingFieldsMap((m) => ({ ...m, [orderId]: false }));
    }
  }

  if (pageQuery === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 mx-auto mt-20 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-gray-300 rounded w-48"></div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 mt-20 mx-auto w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Management
            </h1>
            <p className="text-gray-600">
              {total} {total === 1 ? "order" : "orders"} total
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-4 sm:mt-0"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, user, Razorpay order ID, or product name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={statusFilter ?? ""}
                onChange={(e) => setStatusFilter(e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Order Status</option>
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={paymentStatusFilter ?? ""}
                onChange={(e) =>
                  setPaymentStatusFilter(e.target.value || undefined)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Payment Status</option>
                {PAYMENT_STATUS_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter(undefined);
                  setPaymentStatusFilter(undefined);
                  setPage(1);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {(search || statusFilter || paymentStatusFilter) && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {items.length} of {total} orders
              {search && ` matching "${search}"`}
              {statusFilter && ` with status "${statusFilter}"`}
              {paymentStatusFilter &&
                ` with payment status "${paymentStatusFilter}"`}
            </p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {search || statusFilter || paymentStatusFilter
                  ? "Try adjusting your filters or search terms."
                  : "Orders will appear here when customers place them."}
              </p>
            </div>
          ) : (
            items.map((order: any) => {
              const local = edits[order._id] ?? {
                paymentMethod: order.paymentMethod ?? "",
                razorpayPaymentId: order.razorpayPaymentId ?? "",
              };
              const isExpanded = expandedOrders.has(order._id);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order._id}
                          </h3>
                          <StatusBadge
                            status={order.status ?? "unknown"}
                            type="order"
                          />
                          <StatusBadge
                            status={order.paymentStatus ?? "unknown"}
                            type="payment"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-600">
                          <span>User: {String(order.userId ?? "—")}</span>
                          <span>Updated: {formatDate(order.updatedAt)}</span>
                          <span>
                            Total:{" "}
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(order.total)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mt-4 lg:mt-0"
                      >
                        {isExpanded ? "Hide Details" : "Show Details"}
                        <svg
                          className={`w-4 h-4 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {isExpanded && (
                    <div className="p-6">
                      {/* Items */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {Array.isArray(order.items) &&
                          order.items.length > 0 ? (
                            order.items.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200 flex-none">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.name ?? "item"}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                      No Image
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {item.name ?? "—"}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {item.size && `Size: ${item.size}`}
                                    {item.size && item.color && " • "}
                                    {item.color && `Color: ${item.color}`}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    Quantity: {item.quantity ?? 0} ×{" "}
                                    {formatCurrency(item.price)}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">
                              No items found
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Discount:</span>
                            <span className="text-green-600">
                              -{formatCurrency(order.discount ?? 0)}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                            <span>Total:</span>
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Order Status */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Order Status
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={
                              typeof order.status === "string"
                                ? order.status
                                : ""
                            }
                            disabled={!!loadingStatusMap[order._id]}
                            onChange={(e) =>
                              changeOrderStatus(order._id, e.target.value)
                            }
                          >
                            {!ORDER_STATUS_OPTIONS.includes(order.status) && (
                              <option value={order.status ?? ""}>
                                {String(order.status ?? "—")}
                              </option>
                            )}
                            {ORDER_STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Payment Status */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Payment Status
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={
                              typeof order.paymentStatus === "string"
                                ? order.paymentStatus
                                : ""
                            }
                            disabled={!!loadingPaymentMap[order._id]}
                            onChange={(e) =>
                              changePaymentStatus(order._id, e.target.value)
                            }
                          >
                            {!PAYMENT_STATUS_OPTIONS.includes(
                              order.paymentStatus
                            ) && (
                              <option value={order.paymentStatus ?? ""}>
                                {String(order.paymentStatus ?? "—")}
                              </option>
                            )}
                            {PAYMENT_STATUS_OPTIONS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Payment Method
                          </label>
                          <select
                            value={local.paymentMethod}
                            onChange={(e) =>
                              onEditFieldChange(
                                order._id,
                                "paymentMethod",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="">
                              {order.paymentMethod ?? "—"}
                            </option>
                            {PAYMENT_METHOD_OPTIONS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Razorpay Payment ID */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Razorpay Payment ID
                          </label>
                          <input
                            type="text"
                            value={local.razorpayPaymentId}
                            onChange={(e) =>
                              onEditFieldChange(
                                order._id,
                                "razorpayPaymentId",
                                e.target.value
                              )
                            }
                            placeholder={
                              order.razorpayPaymentId ?? "Enter payment ID"
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>

                        {/* Save Button */}
                        <div className="flex items-end">
                          <button
                            type="button"
                            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            onClick={() => savePaymentFields(order._id)}
                            disabled={!!savingFieldsMap[order._id]}
                          >
                            {savingFieldsMap[order._id] ? (
                              <span className="flex items-center justify-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Saving...
                              </span>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
