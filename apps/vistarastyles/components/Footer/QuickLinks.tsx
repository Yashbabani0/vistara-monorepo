import Link from "next/link";
import React from "react";

export default function QuickLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Links</h3>
      <ul className="space-y-2">
        <li>
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
          >
            Contact Us
          </Link>
        </li>
        <li>
          <Link
            href="/shipping"
            className="text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
          >
            Shipping Information
          </Link>
        </li>
        <li>
          <Link
            href="/returns"
            className="text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
          >
            Returns & Exchanges
          </Link>
        </li>
      </ul>
    </div>
  );
}
