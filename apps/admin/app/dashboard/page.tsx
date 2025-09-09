// "use client";
// import React, { useState } from "react";
// import {
//   ShoppingCart,
//   Users,
//   Package,
//   DollarSign,
//   ArrowUpRight,
//   ArrowDownRight,
//   Calendar,
//   Filter,
//   IndianRupee,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const Dashboard = () => {
//   const [timeFilter, setTimeFilter] = useState("7d");

//   // Sample data
//   const salesData = [
//     { name: "Mon", sales: 4000, orders: 45 },
//     { name: "Tue", sales: 3000, orders: 38 },
//     { name: "Wed", sales: 5000, orders: 62 },
//     { name: "Thu", sales: 4500, orders: 55 },
//     { name: "Fri", sales: 6000, orders: 70 },
//     { name: "Sat", sales: 7500, orders: 88 },
//     { name: "Sun", sales: 5500, orders: 65 },
//   ];

//   const productPerformance = [
//     { name: "Wireless Headphones", sales: 850, revenue: 42500, stock: 23 },
//     { name: "Smartphone Case", sales: 720, revenue: 21600, stock: 156 },
//     { name: "Laptop Stand", sales: 580, revenue: 34800, stock: 45 },
//     { name: "Gaming Mouse", sales: 490, revenue: 24500, stock: 78 },
//     { name: "USB Cable", sales: 430, revenue: 8600, stock: 234 },
//   ];

//   const customerSegments = [
//     { name: "New Customers", value: 35, color: "#3b82f6" },
//     { name: "Returning Customers", value: 45, color: "#10b981" },
//     { name: "VIP Customers", value: 20, color: "#f59e0b" },
//   ];

//   const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
//     const isPositive = change > 0;
//     const colorClasses = {
//       blue: "bg-blue-500",
//       green: "bg-green-500",
//       purple: "bg-purple-500",
//       orange: "bg-orange-500",
//     };

//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className={`${colorClasses[color]} p-3 rounded-lg`}>
//             <Icon className="h-6 w-6 text-white" />
//           </div>
//           <div
//             className={`flex items-center text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
//           >
//             {isPositive ? (
//               <ArrowUpRight className="h-4 w-4" />
//             ) : (
//               <ArrowDownRight className="h-4 w-4" />
//             )}
//             {Math.abs(change)}%
//           </div>
//         </div>
//         <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
//         <p className="text-gray-600 text-sm">{title}</p>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 mt-20 mx-auto w-full">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-2">
//             Welcome back! Here's what's happening with your store.
//           </p>
//         </div>

//         {/* Time Filter */}
//         <div className="mb-6">
//           <div className="flex items-center space-x-4">
//             <Calendar className="h-5 w-5 text-gray-500" />
//             <select
//               value={timeFilter}
//               onChange={(e) => setTimeFilter(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="7d">Last 7 days</option>
//               <option value="30d">Last 30 days</option>
//               <option value="90d">Last 90 days</option>
//               <option value="1y">Last year</option>
//             </select>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Recent Orders
//             </h3>
//             <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//               View All
//             </button>
//           </div>
//           <div className="space-y-4">
//             {[
//               {
//                 id: "#1234",
//                 customer: "John Doe",
//                 product: "Wireless Headphones",
//                 amount: "₹299",
//                 status: "Completed",
//                 time: "2 hours ago",
//               },
//               {
//                 id: "#1235",
//                 customer: "Jane Smith",
//                 product: "Smartphone Case",
//                 amount: "₹49",
//                 status: "Processing",
//                 time: "4 hours ago",
//               },
//               {
//                 id: "#1236",
//                 customer: "Mike Johnson",
//                 product: "Gaming Mouse",
//                 amount: "₹79",
//                 status: "Shipped",
//                 time: "6 hours ago",
//               },
//               {
//                 id: "#1237",
//                 customer: "Sarah Wilson",
//                 product: "USB Cable",
//                 amount: "₹19",
//                 status: "Completed",
//                 time: "8 hours ago",
//               },
//             ].map((order, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//               >
//                 <div className="flex items-center space-x-4">
//                   <div>
//                     <div className="font-medium text-gray-900">{order.id}</div>
//                     <div className="text-sm text-gray-600">
//                       {order.customer}
//                     </div>
//                   </div>
//                   <div className="hidden md:block">
//                     <div className="text-gray-700">{order.product}</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <div className="text-right">
//                     <div className="font-medium text-gray-900">
//                       {order.amount}
//                     </div>
//                     <div className="text-sm text-gray-600">{order.time}</div>
//                   </div>
//                   <span
//                     className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
//                       order.status === "Completed"
//                         ? "bg-green-100 text-green-800"
//                         : order.status === "Processing"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-blue-100 text-blue-800"
//                     }`}
//                   >
//                     {order.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             title="Total Revenue"
//             value="₹45,250"
//             change={12.5}
//             icon={IndianRupee}
//             color="green"
//           />
//           <StatCard
//             title="Total Orders"
//             value="1,423"
//             change={8.2}
//             icon={ShoppingCart}
//             color="blue"
//           />
//           <StatCard
//             title="Total Customers"
//             value="892"
//             change={15.3}
//             icon={Users}
//             color="purple"
//           />
//           <StatCard
//             title="Products Sold"
//             value="3,240"
//             change={-2.1}
//             icon={Package}
//             color="orange"
//           />
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Sales Overview */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Sales Overview
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={salesData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" stroke="#666" />
//                 <YAxis stroke="#666" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "white",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "8px",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#3b82f6"
//                   strokeWidth={3}
//                   dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Customer Segments */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Customer Segments
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={customerSegments}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) =>
//                     `${name} ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {customerSegments.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Product Performance */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Product Performance
//             </h3>
//             <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
//               <Filter className="h-4 w-4 mr-1" />
//               Filter
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                     Product
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                     Sales
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                     Revenue
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                     Stock
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {productPerformance.map((product, index) => (
//                   <tr
//                     key={index}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="py-3 px-4">
//                       <div className="font-medium text-gray-900">
//                         {product.name}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-gray-700">{product.sales}</td>
//                     <td className="py-3 px-4 text-gray-700">
//                       ₹{product.revenue.toLocaleString()}
//                     </td>
//                     <td className="py-3 px-4 text-gray-700">{product.stock}</td>
//                     <td className="py-3 px-4">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           product.stock < 50
//                             ? "bg-red-100 text-red-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {product.stock < 50 ? "Low Stock" : "In Stock"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React from 'react'

export default function page() {
  return (
    <div>
      dashboard use sidebar to navigate
    </div>
  )
}
