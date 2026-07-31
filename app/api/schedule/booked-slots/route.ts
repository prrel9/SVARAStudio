import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json([]);
    }

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("studio_id, start_time, end_time")
      .eq("booking_date", date)
      .in("booking_status", ["pending_payment", "waiting_verification", "confirmed"]);

    if (error || !data) {
      return NextResponse.json([]);
    }

    const slots = data.map((row) => ({
      studioId: row.studio_id,
      startHour: parseInt(row.start_time.split(":")[0], 10),
      endHour: parseInt(row.end_time.split(":")[0], 10),
    }));

    return NextResponse.json(slots, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json([]);
  }
}
