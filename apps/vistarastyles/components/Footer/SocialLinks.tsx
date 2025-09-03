import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SocialLinks() {
  return (
    <div className="flex space-x-4">
      <Link
        href="https://twitter.com"
        className="text-gray-600 hover:text-gray-900"
      >
        <Twitter className="h-5 w-5" />
      </Link>
      <Link
        href="https://facebook.com"
        className="text-gray-600 hover:text-gray-900"
      >
        <Facebook className="h-5 w-5" />
      </Link>
      <Link
        href="https://instagram.com"
        className="text-gray-600 hover:text-gray-900"
      >
        <Instagram className="h-5 w-5" />
      </Link>
    </div>
  );
}
