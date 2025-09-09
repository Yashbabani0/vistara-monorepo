"use client";

import React from "react";
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  Star,
  Leaf,
  Clock,
  Phone,
  Ruler,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FeaturesSection() {
  // Keep icon references (components) here instead of JSX elements — safer for SSR/Client boundaries
  const features = [
    {
      id: "free-shipping",
      title: "Free & Fast Shipping",
      description:
        "Complimentary shipping across India with quick dispatch — get your order delivered reliably.",
      Icon: Truck,
    },
    {
      id: "easy-returns",
      title: "7‑Day Easy Returns",
      description:
        "Changed your mind? Easy returns within 7 days — no hassles, no questions asked.",
      Icon: RefreshCw,
    },
    {
      id: "secure-payments",
      title: "Secure Payments",
      description:
        "Multiple payment options with industry‑standard encryption for safe checkout.",
      Icon: ShieldCheck,
    },
    {
      id: "quality-fabrics",
      title: "Premium Quality",
      description:
        "Curated premium fabrics and attention to detail for lasting comfort and fit.",
      Icon: Star,
    },
    {
      id: "eco-packaging",
      title: "Eco‑Friendly Packaging",
      description:
        "Sustainable packaging choices to reduce environmental impact.",
      Icon: Leaf,
    },
    {
      id: "fast-support",
      title: "Dedicated Support",
      description:
        "Responsive customer support to assist with orders, sizing and returns.",
      Icon: Phone,
    },
    {
      id: "size-guide",
      title: "Accurate Size Guide",
      description:
        "Detailed size and fit information to help you choose the perfect tee.",
      Icon: Ruler,
    },
    {
      id: "same-day",
      title: "Express Options",
      description:
        "Need it urgently? Choose express delivery at checkout for faster delivery windows.",
      Icon: Clock,
    },
  ];

  return (
    <section
      aria-labelledby="features-heading"
      className="bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="features-heading"
            className="text-3xl font-bold leading-tight text-gray-900"
          >
            Why shop with Vistara Styles
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Thoughtfully crafted men’s tees — dependable service and a
            straightforward shopping experience.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {},
          }}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, idx) => {
            const Icon = f.Icon;
            return (
              <motion.article
                key={f.id}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.36 }}
                aria-labelledby={`${f.id}-title`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-inner">
                  <span className="text-yellow-500">
                    {Icon ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      <svg className="h-6 w-6" />
                    )}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    id={`${f.id}-title`}
                    className="text-sm font-medium text-gray-900"
                  >
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{f.description}</p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-yellow-400 px-5 py-2 text-sm font-medium text-white shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
