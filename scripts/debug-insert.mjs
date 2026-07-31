// Debug insert into bookings
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

const { data: studios } = await supabase.from("studios").select("id").limit(1);
const studioId = studios[0].id;

const insertPayload = {
  booking_code: "FH-TEST1234",
  studio_id: studioId,
  booking_date: "2026-08-10",
  start_time: "14:00",
  end_time: "16:00",
  duration_hours: 2,
  total_price: 300000,
  booking_status: "pending_payment",
  full_name: "Test Budi",
  whatsapp: "081234567890",
  email: "budi@test.com",
  notes: "E2E test booking",
  expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
};

console.log("Trying direct insert into bookings with payload:", insertPayload);

const { data, error } = await supabase
  .from("bookings")
  .insert(insertPayload)
  .select()
  .single();

console.log("Insert result:");
console.log("Data:", data);
console.log("Error:", error);

if (data) {
  // Clean up
  await supabase.from("bookings").delete().eq("id", data.id);
  console.log("Cleaned up test row.");
}
