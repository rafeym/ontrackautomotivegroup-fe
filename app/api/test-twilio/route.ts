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
      to: "+16477052049", // <-- put your number here
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message });
  }
}
