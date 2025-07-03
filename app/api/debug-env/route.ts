import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ?? "undefined",
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "set" : "undefined",
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ?? "undefined",
    NODE_ENV: process.env.NODE_ENV ?? "undefined",
  });
}
