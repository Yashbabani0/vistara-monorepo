// apps/admin/app/dashboard/analytics/sales/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

const COLORS = ["#4F46E5", "#06B6D4", "#F97316", "#10B981", "#EF4444"];

function formatIsoDateLocal(dateMs: number, tz = "Asia/Kolkata") {
  try {
    const ms = Number(dateMs);
    return new Date(ms).toLocaleDateString("en-CA", { timeZone: tz });
  } catch {
    return new Date(Number(dateMs)).toISOString().slice(0, 10);
  }
}

function formatDateTimeLocal(dateVal?: number) {
  if (typeof dateVal === "undefined" || dateVal === null) return "—";
  let ms = Number(dateVal);
  if (Number.isNaN(ms)) return "—";
  if (ms < 1_000_000_000_000) ms = ms * 1000;
  try {
    return new Date(ms).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  } catch {
    return new Date(ms).toString();
  }
}

const formatCurrency = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(n)
    : "—";

export default function AdminSalesAnalytics() {
  const now = Date.now();
  const defaultFrom = now - 30 * 24 * 60 * 60 * 1000;

  const [from, setFrom] = useState<number>(defaultFrom);
  const [to, setTo] = useState<number>(now);

  const summary = useQuery(api.ordersAnalytics.getSalesSummary, { from, to });
  const daily = useQuery(api.ordersAnalytics.getDailySales, {
    from,
    to,
    tz: "Asia/Kolkata",
  });
  const topProducts = useQuery(api.ordersAnalytics.getTopProducts, {
    from,
    to,
    limit: 6,
  });
  const categories = useQuery(api.ordersAnalytics.getRevenueByCategory, {
    from,
    to,
  });

  const recentOrdersPage = useQuery(api.orders.getOrdersPage, {
    page: 1,
    pageSize: 6,
  });

  const loading =
    summary === undefined ||
    daily === undefined ||
    topProducts === undefined ||
    categories === undefined;

  const dailyData = daily ?? [];
  const productData = topProducts ?? [];
  // USE categoryName returned from server
  const categoryData = (categories ?? []).map((c: any) => ({
    name: c.categoryName ?? String(c.categoryId ?? "Uncategorized"),
    value: c.revenue ?? 0,
  }));

  return (
    <div className="container mx-auto p-6 w-full mt-20">
      <h1 className="text-2xl font-semibold mb-4">Sales & Analytics</h1>

      {loading ? (
        <div className="p-6 bg-white rounded shadow mb-6">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ) : null}

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Revenue</div>
          <div className="text-xl font-bold">
            {formatCurrency(summary?.totalRevenue)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Range: {formatIsoDateLocal(from)} → {formatIsoDateLocal(to)}
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Orders</div>
          <div className="text-xl font-bold">{summary?.totalOrders ?? "—"}</div>
          <div className="text-xs text-gray-400 mt-1">
            Cancelled: {summary?.cancelledCount ?? 0}
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Avg Order Value</div>
          <div className="text-xl font-bold">
            {formatCurrency(summary?.avgOrderValue)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Refunds: {formatCurrency(summary?.refundsAmount)}
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Top Product (this range)</div>
          <div className="text-xl font-bold">
            {productData.length > 0 ? productData[0].name : "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Revenue: {formatCurrency(productData?.[0]?.revenue)}
          </div>
        </div>
      </div>

      {/* Date controls */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-600">From</label>
        <input
          type="date"
          value={formatIsoDateLocal(from)}
          onChange={(e) =>
            setFrom(new Date(e.target.value + "T00:00:00+05:30").getTime())
          }
          className="border rounded p-2"
        />

        <label className="text-sm text-gray-600">To</label>
        <input
          type="date"
          value={formatIsoDateLocal(to)}
          onChange={(e) =>
            setTo(new Date(e.target.value + "T23:59:59+05:30").getTime())
          }
          className="border rounded p-2"
        />

        <Button
          onClick={() => {
            setFrom(Date.now() - 7 * 24 * 60 * 60 * 1000);
            setTo(Date.now());
          }}
        >
          Last 7d
        </Button>
        <Button
          onClick={() => {
            setFrom(Date.now() - 30 * 24 * 60 * 60 * 1000);
            setTo(Date.now());
          }}
        >
          Last 30d
        </Button>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Daily Revenue</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d) => String(d)} />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Top Products (Revenue)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Bar dataKey="revenue" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Revenue by Category</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Recent Orders (preview)</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="py-2 px-2">Id</th>
                  <th className="py-2 px-2">User</th>
                  <th className="py-2 px-2">Total</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray((recentOrdersPage as any)?.items) &&
                (recentOrdersPage as any).items.length > 0 ? (
                  (recentOrdersPage as any).items.map((o: any) => (
                    <tr key={o._id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-2 font-mono text-xs">{o._id}</td>
                      <td className="py-2 px-2">
                        {o.userName
                          ? o.userName
                          : o.userEmail
                            ? o.userEmail
                            : String(o.userId ?? "—")}
                      </td>{" "}
                      <td className="py-2 px-2">{formatCurrency(o.total)}</td>
                      <td className="py-2 px-2">{String(o.status ?? "—")}</td>
                      <td className="py-2 px-2">
                        {formatDateTimeLocal(o.updatedAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 px-2 text-center text-gray-500"
                    >
                      No preview available. To enable recent orders preview,
                      ensure server exposes `getOrdersPage` and the generated
                      `api` includes it.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        Tip: For high-volume stores, prefer maintaining `daily_sales` aggregates
        server-side and query that table to make charts cheaper.
      </div>
    </div>
  );
}
