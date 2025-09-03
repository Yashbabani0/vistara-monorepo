// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  try { 
    await resend.emails.send({
      from: "Vistara Styles <noreply@vistarastyles.com>",
      to: email,
      subject: "Welcome to Vistara Styles ✨",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Welcome to Vistara Styles!</h2>
          <p>Thanks for subscribing to our newsletter. 🎉</p>
          <p>We’ll keep you updated with exclusive offers, latest collections, and style tips.</p>
          <br />
          <p>Best,<br/>The Vistara Styles Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
