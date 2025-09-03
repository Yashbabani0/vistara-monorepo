"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Polo T-Shirts",
    href: "/category/polo-tshirts",
    description: "Classic polo t-shirts for a smart casual look",
  },
  {
    title: "Full Sleeve T-Shirts",
    href: "/category/full-sleeve",
    description: "Comfortable full sleeve t-shirts for complete coverage",
  },
  {
    title: "Half Sleeve T-Shirts",
    href: "/category/half-sleeve",
    description: "Casual half sleeve t-shirts for everyday wear",
  },
  {
    title: "Sleeveless T-Shirts",
    href: "/category/sleeveless",
    description: "Perfect for workouts and summer days",
  },
  {
    title: "Oversized T-Shirts",
    href: "/category/oversized",
    description: "Trendy oversized fits for a relaxed style",
  },
  {
    title: "Graphic T-Shirts",
    href: "/category/graphic",
    description: "Express yourself with unique graphic designs",
  },
];

const collections = [
  {
    title: "Summer Collection",
    href: "/collections/summer",
    description: "Light and breathable t-shirts for hot days",
  },
  {
    title: "Premium Cotton",
    href: "/collections/premium-cotton",
    description: "Luxurious cotton t-shirts for ultimate comfort",
  },
  {
    title: "Active Wear",
    href: "/collections/active-wear",
    description: "Performance t-shirts for sports and fitness",
  },
  {
    title: "Limited Edition",
    href: "/collections/limited-edition",
    description: "Exclusive designs in limited quantities",
  },
  {
    title: "Basics",
    href: "/collections/basics",
    description: "Essential solid color t-shirts for everyday wear",
  },
  {
    title: "Sustainable",
    href: "/collections/sustainable",
    description: "Eco-friendly t-shirts made from organic materials",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function PcMenu() {
  return (
    <div className="hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>T-Shirt Styles</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {categories.map((category) => (
                  <ListItem
                    key={category.title}
                    title={category.title}
                    href={category.href}
                  >
                    {category.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {collections.map((collection) => (
                  <ListItem
                    key={collection.title}
                    title={collection.title}
                    href={collection.href}
                  >
                    {collection.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/new-arrivals"
                className={navigationMenuTriggerStyle()}
              >
                New Arrivals
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
