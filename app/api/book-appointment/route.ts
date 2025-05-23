// app/api/book-appointment/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";
import { Twilio } from "twilio";
import { parseISO } from "date-fns";
import { Resend } from "resend";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const formatPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  throw new Error("Invalid Canadian phone number");
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const vin = url.searchParams.get("vin");

  if (!date || !vin) {
    return NextResponse.json(
      { success: false, error: "Date and VIN are required" },
      { status: 400 }
    );
  }

  try {
    const parsedDate = parseISO(date);
    const dateOnlyString = parsedDate.toISOString().split("T")[0];

    const bookings = await sanityClient.fetch(
      `*[_type == "booking" && date == $date && car.vin == $vin] {
        timeSlot
      }`,
      { date: dateOnlyString, vin }
    );

    const bookedSlots = bookings.map((b: { timeSlot: string }) => b.timeSlot);

    return NextResponse.json({ success: true, bookedSlots });
  } catch (error: unknown) {
    console.error("Error fetching slots:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const {
    name,
    email,
    phone,
    vin,
    make,
    model,
    year,
    mileage,
    price,
    timeSlot,
    date,
  } = data;

  try {
    // Check if car is available
    const carData = await sanityClient.fetch(
      `*[_type == "car" && vin == $vin][0]{isAvailable}`,
      { vin }
    );

    if (!carData) {
      return NextResponse.json(
        { success: false, error: "Car not found." },
        { status: 404 }
      );
    }

    if (!carData.isAvailable) {
      return NextResponse.json(
        {
          success: false,
          error: "This car is sold or unavailable for booking.",
        },
        { status: 400 }
      );
    }

    const dateOnlyString = date.split("T")[0]; // Keep only YYYY-MM-DD
    const formattedPhone = formatPhoneNumber(phone);

    // Check if time slot is already booked for this date and car
    const existing = await sanityClient.fetch(
      `*[_type == "booking" && date == $date && timeSlot == $timeSlot && car.vin == $vin]`,
      { date: dateOnlyString, timeSlot, vin }
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "This time slot is already booked." },
        { status: 400 }
      );
    }

    const booking = await sanityClient.create({
      _type: "booking",
      name,
      email,
      phone,
      timeSlot,
      date: dateOnlyString,
      car: {
        vin,
        make,
        model,
        year,
        mileage,
        price,
      },
    });

    const message = `Hi ${name}, we've received your appointment request for the ${year} ${make} ${model} (VIN: ${vin}). A representative will contact you soon to confirm your appointment on ${dateOnlyString} at ${timeSlot}. Thank you!`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: formattedPhone,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Booking <noreply@resend.dev>",
      to: [process.env.DEALERSHIP_EMAIL!],
      replyTo: email,
      subject: `[Car Booking] - ${name} (${vin})`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2 style="color: #004085;">New Appointment Booking</h2>
      <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
      <hr style="margin: 1rem 0;" />

      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <hr style="margin: 1rem 0;" />

      <h3>Vehicle Details</h3>
      <p><strong>VIN:</strong> ${vin}</p>
      <p><strong>Make:</strong> ${make}</p>
      <p><strong>Model:</strong> ${model}</p>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Mileage:</strong> ${mileage} km</p>
      <p><strong>Price:</strong> $${price}</p>
      <hr style="margin: 1rem 0;" />

      <h3>Booking Information</h3>
      <p><strong>Date:</strong> ${date.split("T")[0]}</p>
      <p><strong>Time Slot:</strong> ${timeSlot}</p>

      <br/>
      <p style="font-size: 0.9rem; color: #6c757d;">Please contact the customer to confirm or reschedule the appointment if needed.</p>
    </div>
  `,
    });

    return NextResponse.json({ success: true, bookingId: booking._id });
  } catch (error: unknown) {
    console.error("Error booking:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
