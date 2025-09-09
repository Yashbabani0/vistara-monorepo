import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api as convexApi } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// POST handler for app router
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(payload)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // update Convex order to paid
      await convex.mutation(convexApi.orders.confirmPayment, {
        orderId,
        razorpayPaymentId: razorpay_payment_id,
      });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // mark failed
      await convex
        .mutation(convexApi.orders.confirmPayment, {
          orderId,
          razorpayPaymentId: razorpay_payment_id,
        })
        .catch(() => {}); // best-effort
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err: any) {
    console.error("verify-razorpay-payment error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
