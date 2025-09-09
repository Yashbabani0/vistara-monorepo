// File: app/api/razorpay/create-razorpay-order/route.ts
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST handler for app router
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency, receipt } = body;

    if (!amount || !currency) {
      return new Response(JSON.stringify({ error: "Missing amount or currency" }), { status: 400 });
    }

    // create razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("create-razorpay-order error:", err);
    const message = err?.message || "Unknown server error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
