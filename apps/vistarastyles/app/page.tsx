import FastSelling from "@/components/Home/FastSelling/FastSelling";
import FeaturesSection from "@/components/Home/Features/Features";
import Hero from "@/components/Home/Hero/Hero";
import LimitedEdition from "@/components/Home/LimitedEdition/LimitedEdition";
import NewArrivalss from "@/components/Home/NewArrivals/NewArrivals";
import Sale from "@/components/Home/Sale/Sale";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <FastSelling />
      <NewArrivalss />
      <FeaturesSection />
      <Sale />
      <LimitedEdition />
    </div>
  );
}
