"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

// Newsletter schema with Zod
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// Type inference from the schema
type NewsletterForm = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subscribe = useMutation(api.newsletter.subscribe);

  const form = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: NewsletterForm) => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await subscribe({ email: data.email });

      if (
        result?.success === false &&
        result?.message === "Already subscribed"
      ) {
        setMessage("⚠️ Already subscribed.");
      } else if (result?.success === true) {
        // ✅ Call Next.js API to send mail
        try {
          const res = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
          });

          if (!res.ok) throw new Error("Failed to send email");

          setMessage("✅ Subscribed! Check your email.");
          form.reset({ email: "" });
        } catch (mailErr) {
          console.error("Email send error:", mailErr);
          setMessage("✅ Subscribed, but email failed to send.");
        }
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to subscribe. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setMessage(null); // clear message when typing
                  }}
                  className="border rounded-lg p-2 w-full"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading || !form.formState.isValid}
          className="text-white rounded-lg px-4 py-3 cursor-pointer"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>

        {message && (
          <p
            className={`text-sm text-center mt-2 ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </Form>
  );
}

// Add PPR boundary
export const runtime = "edge";
export const preferredRegion = "auto";
export const dynamic = "force-dynamic";
