"use client";

import React, { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const heroBanner = useQuery(api.heroBanners.getActive) as any[] | null;
  const slides = Array.isArray(heroBanner) ? heroBanner : [];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (index >= slides.length) setIndex(Math.max(0, slides.length - 1));
  }, [slides.length, index]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth;
    el.scrollTo({ left: slideWidth * index, behavior: "smooth" });
  }, [index]);

  // autoplay logic
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(slides.length - 1, i + 1));

  if (!slides.length) {
    return (
      <Card className="w-full rounded-none">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No active banners to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section
      className="relative w-screen"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel viewport */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-4 no-scrollbar"
        aria-roledescription="carousel"
      >
        {slides.map((s: any, i: number) => (
          <div
            key={s._id ?? i}
            className="min-w-full snap-center flex-shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            <div className="relative h-[420px] md:h-[560px] w-full">
              {/* Responsive images */}
              <picture>
                {s.mobileImageUrl && (
                  <source
                    srcSet={s.mobileImageUrl}
                    media="(max-width: 640px)"
                  />
                )}
                {s.tabletImageUrl && (
                  <source
                    srcSet={s.tabletImageUrl}
                    media="(max-width: 1024px)"
                  />
                )}
                <img
                  src={s.pcImageUrl}
                  alt={s.pcAltText ?? s.title ?? `Banner ${i + 1}`}
                  className="object-cover w-full h-full rounded-none"
                />
              </picture>

              {/* Overlay content */}
              {s.title && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent rounded-2xl flex items-center">
                  <div className="p-6 md:p-12 max-w-2xl text-white">
                    <h2 className="text-2xl md:text-4xl font-semibold leading-tight">
                      {s.title}
                    </h2>
                    {s.url && (
                      <div className="mt-6">
                        <Link href={s.url} aria-label={s.title}>
                          <Button>Shop Now</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute inset-y-1/2 left-4 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          aria-label="Previous slide"
          disabled={index === 0}
        >
          <ChevronLeft />
        </Button>
      </div>

      <div className="absolute inset-y-1/2 right-4 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          aria-label="Next slide"
          disabled={index === slides.length - 1}
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-8 rounded-full transition-all ${i === index ? "scale-100" : "opacity-50"}`}
            style={{
              background: i === index ? "currentColor" : "rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
