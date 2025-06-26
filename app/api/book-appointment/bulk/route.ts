import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";
import { parseISO } from "date-fns";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const datesParam = url.searchParams.get("dates");
  const vin = url.searchParams.get("vin");

  if (!datesParam || !vin) {
    return NextResponse.json(
      { success: false, error: "Dates and VIN are required" },
      { status: 400 }
    );
  }

  try {
    const dates = datesParam.split(",");

    // Validate dates
    const validDates = dates.map((dateStr) => {
      try {
        const parsed = parseISO(dateStr);
        return parsed.toISOString().split("T")[0];
      } catch {
        throw new Error(`Invalid date format: ${dateStr}`);
      }
    });

    // Fetch all bookings for the specified dates and VIN
    const bookings = await sanityClient.fetch(
      `*[_type == "booking" && date in $dates && car.vin == $vin] {
        date,
        timeSlot
      }`,
      { dates: validDates, vin }
    );

    // Group bookings by date
    const bookedSlots: Record<string, string[]> = {};

    bookings.forEach((booking: { date: string; timeSlot: string }) => {
      if (!bookedSlots[booking.date]) {
        bookedSlots[booking.date] = [];
      }
      bookedSlots[booking.date].push(booking.timeSlot);
    });

    // Ensure all requested dates are in the response (even if empty)
    validDates.forEach((date) => {
      if (!bookedSlots[date]) {
        bookedSlots[date] = [];
      }
    });

    return NextResponse.json({
      success: true,
      bookedSlots,
    });
  } catch (error: unknown) {
    console.error("Error fetching bulk slots:", error);
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
