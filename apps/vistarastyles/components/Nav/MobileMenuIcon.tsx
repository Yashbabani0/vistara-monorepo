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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MobileMenuIcon() {
  const [open, setOpen] = React.useState(false);
  const categories = useQuery(api.categories.getCategories);
  const collections = useQuery(api.collections.getCollections);

  if (categories === undefined || collections === undefined) {
    return <p>Loading menu...</p>;
  }

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
              {/* Categories */}
              <AccordionItem value="categories">
                <AccordionTrigger className="px-4">Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    {categories.map((category) => (
                      <Link
                        href={`/categories/${category.slug}`}
                        key={category._id}
                        className="flex items-center px-8 py-3 text-sm hover:bg-gray-100 hover:text-yellow-400 transition-all duration-300 ease-in-out"
                        onClick={() => setOpen(false)}
                      >
                        {category.name}
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Collections */}
              <AccordionItem value="collections">
                <AccordionTrigger className="px-4">
                  Collections
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    {collections.map((collection) => (
                      <Link
                        href={`/collections/${collection.slug}`}
                        key={collection._id}
                        className="flex items-center px-8 py-3 text-sm hover:bg-gray-100 hover:text-yellow-400 transition-all duration-300 ease-in-out"
                        onClick={() => setOpen(false)}
                      >
                        {collection.name}
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Link href="/shop" className="flex items-center px-4 py-3 text-sm">
              Shop
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
