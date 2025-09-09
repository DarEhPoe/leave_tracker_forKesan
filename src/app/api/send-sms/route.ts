import { NextRequest, NextResponse } from "next/server";
import { sendSms } from "@/lib/sendSms";

type SendSmsRequest = {
  to: string[] | string;
  message: string;
};

export async function POST(req: NextRequest) {
  const body: SendSmsRequest = await req.json().catch(() => ({ to: [], message: "" }));
  const { to, message } = body ?? {};

  // Defensive: normalize and dedupe recipients server-side
  const raw = Array.isArray(to) ? to : [to];
  const recipients = Array.from(new Set(raw.map((r: string) => String(r ?? "").trim()))).filter(Boolean);

  if (!recipients.length || !message) {
    return NextResponse.json({ success: false, error: "Missing valid 'to' or 'message'" }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      recipients.map((recipient: string) => sendSms(recipient, String(message)))
    );
    return NextResponse.json({ success: true, sent: results.length, results });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}