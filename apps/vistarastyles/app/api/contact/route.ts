// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const resend = new Resend(process.env.RESEND_API_KEY);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Save to Convex
    await convex.mutation(api.contactusform.createContact, body);

    // Send confirmation email
    await resend.emails.send({
      from: "noreply@vistarastyles.com",
      to: body.email,
      subject: "We received your message",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #facc15; padding: 16px; text-align: center;">
      <h1 style="margin: 0; color: #111827; font-size: 20px;">Vistara Styles</h1>
    </div>
    <div style="padding: 20px; color: #374151;">
      <p style="font-size: 16px;">Hi <strong>${body.name}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6;">
        Thank you for reaching out to <strong>Vistara Styles</strong>. 
        We’ve received your message regarding <em>${body.subject}</em>.
      </p>
      <p style="font-size: 15px; line-height: 1.6;">
        Our support team will get back to you within <strong>24 hours</strong>.
      </p>
      <p style="margin-top: 24px; font-size: 15px;">Best regards,</p>
      <p style="font-size: 15px; font-weight: bold;">The Vistara Styles Team</p>
    </div>
    <div style="background-color: #f9fafb; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
      <p style="margin: 4px 0;">Vistara Styles</p>
      <p style="margin: 0;">Dr. Shyama Prashad Mukherjee Nagar, Building-G, Flat No. 504, Rajkot, Gujarat</p>
      <p style="margin: 0;">This is an automated email. Please do not reply.</p>
    </div>
  </div>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
