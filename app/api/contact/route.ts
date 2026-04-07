import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, reason, message } = await req.json();
    if (!name || !email || !reason || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // TODO: wire up Resend or similar email service
    // For now, log to console and return success
    console.log("Contact form submission:", { name, email, reason, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
