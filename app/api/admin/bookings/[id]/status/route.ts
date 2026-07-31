import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatusAdmin } from "@/lib/services/bookings";
import type { BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status: BookingStatus };

    if (!status) {
      return NextResponse.json({ error: "Missing status parameter" }, { status: 400 });
    }

    await updateBookingStatusAdmin(id, status);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error updating booking status:", error);
    const message = error instanceof Error ? error.message : "Failed to update booking status";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
