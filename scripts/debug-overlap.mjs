// Debug the checkOverlap function directly
// Run: node scripts/debug-overlap.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = readFileSync(join(__dirname, "../.env.local"), "utf-8");
const env = Object.fromEntries(
  envFile.split("\n").filter(l => l && !l.startsWith("#")).map(l => {
    const [k, ...v] = l.split("=");
    return [k.trim(), v.join("=").trim()];
  })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const ACTIVE_STATUSES = ["pending_payment", "waiting_verification", "confirmed"];
const studioId = "test-studio-1";
const bookingDate = "2026-07-30";
const newStart = "10:00";
const newEnd = "12:00";

console.log("Testing checkOverlap query...");
console.log({ studioId, bookingDate, newStart, newEnd });

const { data, error } = await supabase
  .from("bookings")
  .select("id, booking_status, start_time, end_time")
  .eq("studio_id", studioId)
  .eq("booking_date", bookingDate)
  .in("booking_status", ACTIVE_STATUSES)
  .lt("start_time", newEnd)
  .gt("end_time", newStart);

console.log("\nResult:");
console.log("  data:", data);
console.log("  error:", error);
console.log("  hasOverlap:", error ? "true (fail-safe triggered)" : (data?.length ?? 0) > 0);

// Also test a simple select to verify permissions
console.log("\nSimple select test:");
const { data: all, error: allErr } = await supabase
  .from("bookings")
  .select("id")
  .limit(5);
console.log("  data:", all);
console.log("  error:", allErr);
