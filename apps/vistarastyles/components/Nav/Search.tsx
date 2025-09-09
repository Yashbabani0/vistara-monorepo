"use client";
import { Search as SearchIcon } from "lucide-react";
import React, { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

// This would be your async component that fetches products from Convex
async function SearchResults({ query }: { query: string }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // TODO: Replace this with actual Convex query
  // Example structure of how it would work with Convex:
  // const products = await ctx.db.query("products").filter(product =>
  //   product.name.toLowerCase().includes(query.toLowerCase())
  // ).take(5);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Search Results</h3>
      {/* Placeholder for search results */}
      <div className="space-y-2">
        <div className="p-2 hover:bg-gray-100 rounded">
          <div className="font-medium">Product Name</div>
          <div className="text-sm text-gray-500">$XX.XX</div>
        </div>
        {/* Add more product placeholders as needed */}
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="mt-4 space-y-2">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-2">
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    setSearchQuery(query);
    setIsSearching(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:bg-gray-100 hover:text-yellow-500 transition-all duration-300 ease-in-out rounded-full cursor-pointer flex items-center justify-center">
          <SearchIcon className="w-5 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Search Products</DialogTitle>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <SearchIcon />
            <Input
              type="search"
              name="search"
              placeholder="Search products..."
              className="flex-1"
              autoComplete="off"
              autoFocus
              onChange={(e) => {
                if (e.target.value === "") {
                  setIsSearching(false);
                }
              }}
            />
          </div>
        </form>

        {isSearching && (
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults query={searchQuery} />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
}

// import { SearchIcon } from "lucide-react";
// import React from "react";

// export default function Search() {
//   return (
//     <div className="flex border-2 p-2">
//       <input type="text" className="border-0 outline-0" placeholder="Search" />
//       <SearchIcon />
//     </div>
//   );
// }
