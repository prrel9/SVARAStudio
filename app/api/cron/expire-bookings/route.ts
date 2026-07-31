import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// Protected by CRON_SECRET env variable
// Set this in Vercel/hosting environment and in the cron job header
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("bookings")
      .update({ booking_status: "expired" })
      .eq("booking_status", "pending_payment")
      .lt("expires_at", new Date().toISOString())
      .select("id, booking_code");

    if (error) {
      console.error("expire-bookings error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const expired = data ?? [];
    console.log(`Expired ${expired.length} bookings:`, expired.map((b) => b.booking_code));

    return NextResponse.json({
      expired: expired.length,
      codes: expired.map((b) => b.booking_code),
    });
  } catch (err) {
    console.error("expire-bookings unhandled error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
