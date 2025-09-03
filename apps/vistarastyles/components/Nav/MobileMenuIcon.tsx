"use client";
import { ChevronRight, Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";

const categories = [
  {
    name: "Categories",
    items: [
      { name: "Polo T-Shirts", href: "/category/polo-tshirts" },
      { name: "Full Sleeve T-Shirts", href: "/category/full-sleeve" },
      { name: "Half Sleeve T-Shirts", href: "/category/half-sleeve" },
      { name: "Sleeveless T-Shirts", href: "/category/sleeveless" },
      { name: "Oversized T-Shirts", href: "/category/oversized" },
      { name: "Graphic T-Shirts", href: "/category/graphic" },
    ],
  },
  {
    name: "Collections",
    items: [
      { name: "Summer Collection", href: "/collections/summer" },
      { name: "Premium Cotton", href: "/collections/premium-cotton" },
      { name: "Active Wear", href: "/collections/active-wear" },
      { name: "Limited Edition", href: "/collections/limited-edition" },
      { name: "Basics", href: "/collections/basics" },
      { name: "Sustainable", href: "/collections/sustainable" },
    ],
  },
  {
    name: "Quick Links",
    items: [
      { name: "New Arrivals", href: "/new-arrivals" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Care Instructions", href: "/care-instructions" },
    ],
  },
];

export default function MobileMenuIcon() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="h-10 flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>

          <div className="overflow-y-auto">
            <Accordion type="single" collapsible className="w-full">
              {categories.map((category) => (
                <AccordionItem value={category.name} key={category.name}>
                  <AccordionTrigger className="px-4">
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col">
                      {category.items.map((item) => (
                        <Link
                          href={item.href}
                          key={item.name}
                          className="flex items-center px-8 py-3 text-sm hover:bg-gray-100"
                          onClick={() => setOpen(false)}
                        >
                          {item.name}
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
