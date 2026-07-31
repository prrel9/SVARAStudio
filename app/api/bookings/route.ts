import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkOverlap, createBooking } from "@/lib/services/bookings";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      studioId,
      bookingDate,
      startHour,
      durationHours,
      totalPrice,
      fullName,
      whatsapp,
      email,
      notes,
    } = body;

    // Basic validation
    if (!studioId || !bookingDate || startHour == null || !durationHours || !totalPrice || !fullName || !whatsapp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const endHour = Number(startHour) + Number(durationHours);

    // Anti double-booking check
    const hasOverlap = await checkOverlap({
      studioId: String(studioId),
      bookingDate: String(bookingDate),
      startHour: Number(startHour),
      endHour,
    });

    if (hasOverlap) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose a different slot." },
        { status: 409 }
      );
    }

    const booking = await createBooking({
      studioId: String(studioId),
      bookingDate: String(bookingDate),
      startHour: Number(startHour),
      durationHours: Number(durationHours),
      totalPrice: Number(totalPrice),
      fullName: String(fullName),
      whatsapp: String(whatsapp),
      email: email ? String(email) : undefined,
      notes: notes ? String(notes) : undefined,
    });

    revalidatePath("/schedule");

    return NextResponse.json({
      id: booking.id,
      bookingCode: booking.bookingCode,
      expiresAt: booking.expiresAt,
    });
  } catch (err) {
    console.error("POST /api/bookings error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
