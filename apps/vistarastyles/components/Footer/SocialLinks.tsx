import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SocialLinks() {
  return (
    <div className="flex space-x-4">
      <Link
        href="https://x.com/vistarastyles"
        className="text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
      >
        <Twitter className="h-5 w-5" />
      </Link>
      <Link
        href="https://facebook.com/vistarastyles"
        className="text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
      >
        <Facebook className="h-5 w-5" />
      </Link>
      <Link
        href="https://instagram.com/vistarastyles"
        className="text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
      >
        <Instagram className="h-5 w-5" />
      </Link>
    </div>
  );
}
