import React from "react";
import Newsletter from "./Newsletter";
import ContactInfo from "./ContactInfo";
import QuickLinks from "./QuickLinks";
import SocialLinks from "./SocialLinks";
import BottomSection from "./BottomSection";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-sm text-gray-600 pb-2">
              Your premier destination for high-quality t-shirts. We offer a
              wide range of styles, ensuring comfort and style for every
              occasion.
            </p>
            <SocialLinks />
          </div>

          {/* Quick Links */}
          <QuickLinks />

          {/* Contact Information */}
          <ContactInfo />

          {/* Newsletter */}
          <Newsletter />
        </div>

        {/* Bottom Section */}
        <BottomSection />
      </div>
    </footer>
  );
}
