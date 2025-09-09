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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function PcMenu() {
  const categories = useQuery(api.categories.getCategories);
  const collections = useQuery(api.collections.getCollections);

  if (categories === undefined || collections === undefined) {
    return <p>Loading menu...</p>;
  }

  return (
    <div className="hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Categories */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>T-Shirt Styles</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {categories.map((category) => (
                  <ListItem
                    key={category._id}
                    title={category.name}
                    className=" hover:text-yellow-400"
                    href={`/category/${category.slug}`}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Collections */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {collections.map((collection) => (
                  <ListItem
                    key={collection._id}
                    title={collection.name}
                    className=" hover:text-yellow-400"
                    href={`/collection/${collection.slug}`}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Shop link */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/shop" className={navigationMenuTriggerStyle()}>
                Shop
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
