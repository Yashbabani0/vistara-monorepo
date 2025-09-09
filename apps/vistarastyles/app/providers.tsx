// apps/vistarastyles/app/providers.tsx
"use client";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Only init PostHog in production
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: true,
    persistence: "localStorage",
  });
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <PostHogProvider client={posthog}>
        <CartProvider>{children}</CartProvider>
      </PostHogProvider>
    </ConvexProviderWithClerk>
  );
}
