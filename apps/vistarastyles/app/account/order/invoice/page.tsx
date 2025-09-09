// apps/vistarastyles/app/account/order/invoice/page.tsx
"use client";
import React, { useState } from "react";
import { Calendar, Phone, Mail, MapPin, CreditCard, Truck } from "lucide-react";

interface TShirt {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface CustomerDetails {
  name: string;
  address: string;
  phone: string;
  email?: string;
}

interface InvoiceData {
  orderId: string;
  paymentId?: string;
  paymentMethod: "razorpay" | "cod";
  datePurchased: string;
  customer: CustomerDetails;
  items: TShirt[];
  subtotal: number;
  discount: number;
  total: number;
}

const InvoicePage: React.FC = () => {
  // Sample data - in real app, this would come from props or API
  const [invoiceData] = useState<InvoiceData>({
    orderId: "VS-2024-001234",
    paymentId: "pay_NjE5NzM4NjE5NzM4",
    paymentMethod: "razorpay",
    datePurchased: "2024-09-09",
    customer: {
      name: "Rahul Sharma",
      address: "123 Main Street, Sector 15, Gandhinagar, Gujarat 382015",
      phone: "+919876543210",
      email: "rahul.sharma@email.com",
    },
    items: [
      {
        id: "1",
        name: "Premium Cotton T-Shirt",
        size: "L",
        color: "Navy Blue",
        quantity: 2,
        price: 899,
      },
      {
        id: "2",
        name: "Graphic Print T-Shirt",
        size: "M",
        color: "White",
        quantity: 1,
        price: 799,
      },
      {
        id: "3",
        name: "Polo T-Shirt",
        size: "XL",
        color: "Black",
        quantity: 1,
        price: 1299,
      },
    ],
    subtotal: 3796,
    discount: 200,
    total: 3596,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="text-black p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">VISTARA STYLES</h1>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="text-sm">
                    Dr. Shyama Prashad Mukherjee Nagar, Building-G, Flat no.504
                  </span>
                </div>
                <div className="ml-6 text-sm">Rajkot, Gujarat 360005</div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Phone size={16} />
                    <span className="text-sm">+917623969483</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail size={16} />
                    <span className="text-sm">contactus@vistarastyles.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <p className=" mt-1">#{invoiceData.orderId}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Bill To:
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium text-gray-800">
                  {invoiceData.customer.name}
                </p>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 " />
                  <span className="text-sm">
                    {invoiceData.customer.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="" />
                  <span className="text-sm">{invoiceData.customer.phone}</span>
                </div>
                {invoiceData.customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="" />
                    <span className="text-sm">
                      {invoiceData.customer.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Order Details:
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{invoiceData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Purchase:</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="font-medium">
                      {formatDate(invoiceData.datePurchased)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <div className="flex items-center gap-2">
                    {invoiceData.paymentMethod === "razorpay" ? (
                      <CreditCard size={16} className="text-green-600" />
                    ) : (
                      <Truck size={16} className="text-orange-600" />
                    )}
                    <span className="font-medium">
                      {invoiceData.paymentMethod === "razorpay"
                        ? "Razorpay"
                        : "Cash on Delivery"}
                    </span>
                  </div>
                </div>
                {invoiceData.paymentMethod === "razorpay" &&
                  invoiceData.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium text-sm">
                        {invoiceData.paymentId}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Items Purchased:
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-800 border-b">
                      Item
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-800 border-b">
                      Size
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-800 border-b">
                      Color
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-800 border-b">
                      Qty
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-800 border-b">
                      Price
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-800 border-b">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            (5% GST included)
                          </p>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 border-b text-gray-600">
                        {item.size}
                      </td>
                      <td className="text-center py-3 px-4 border-b text-gray-600">
                        {item.color}
                      </td>
                      <td className="text-center py-3 px-4 border-b text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="text-right py-3 px-4 border-b text-gray-600">
                        ₹{item.price}
                      </td>
                      <td className="text-right py-3 px-4 border-b font-medium text-gray-800">
                        ₹{item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>₹{invoiceData.subtotal}</span>
                  </div>
                  {invoiceData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{invoiceData.discount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total Amount:</span>
                      <span>₹{invoiceData.total}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-2">
                    * All prices include 5% GST
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-600 text-sm">
                  Thank you for your business!
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  For any queries, contact us at contactus@vistarastyles.com
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-md transition-colors duration-200 print:hidden"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
