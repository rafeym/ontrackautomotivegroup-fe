// app/api/test-twilio/route.ts
import { NextResponse } from "next/server";
import { Twilio } from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function GET() {
  try {
    const message = await client.messages.create({
      body: "✅ Test SMS from /api/test-twilio route in production",
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: "+16477052049", // replace this with your own number for testing
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
