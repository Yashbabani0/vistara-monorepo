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
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Contact Us
          </Link>
        </li>
        <li>
          <Link
            href="/size-guide"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Size Guide
          </Link>
        </li>
        <li>
          <Link
            href="/shipping"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Shipping Information
          </Link>
        </li>
        <li>
          <Link
            href="/returns"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Returns & Exchanges
          </Link>
        </li>
      </ul>
    </div>
  );
}
