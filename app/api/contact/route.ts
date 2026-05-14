import { Resend } from "resend";
import { NextResponse } from "next/server";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = cleanField(body.name);
    const email = cleanField(body.email);
    const reason = cleanField(body.reason || body.type);
    const message = cleanField(body.message);

    if (!name || !email || !reason || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Email is not configured" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Website Contact <alexio@alexiogessa.com>",
      to: "alexio@alexiogessa.com",
      replyTo: email,
      subject: `New website inquiry from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Interest:</strong> ${escapeHtml(reason)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
