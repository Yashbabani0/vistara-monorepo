"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { ReactNode } from "react";

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
    <ConvexProvider client={convex}>
      <PostHogProvider client={posthog}>{children}</PostHogProvider>
    </ConvexProvider>
  );
}
