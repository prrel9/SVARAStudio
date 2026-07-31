import { createClient } from "@/lib/supabase/server";
import type { Stat } from "@/lib/types";

export async function getStats(): Promise<Stat[]> {
  const supabase = await createClient();
  const { count: studioCount } = await supabase
    .from("studios")
    .select("*", { count: "exact", head: true });

  const { count: bookingCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const totalBookings = (bookingCount || 0) + 500;

  return [
    { value: `${totalBookings}+`, label: "Sessions Booked" },
    { value: `${studioCount || 6}`, label: "Professional Studios" },
    { value: "4.9★", label: "Average Rating" },
    { value: "3+", label: "Years Experience" },
  ];
}
