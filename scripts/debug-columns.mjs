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

const statusesToTest = ["pending", "pending_payment", "waiting_verification", "confirmed", "active", "cancelled"];

for (const statusVal of statusesToTest) {
  const payload = {
    booking_code: "FH-TEST-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
    studio_id: "91b6dc0c-78eb-410f-928d-a0d60206dd9b",
    booking_date: "2026-08-10",
    start_time: "14:00",
    end_time: "16:00",
    duration_hours: 2,
    total_price: 300000,
    booking_status: statusVal,
    full_name: "Test Budi",
    whatsapp: "081234567890",
    customer_name: "Test Budi",
    customer_phone: "081234567890",
    email: "budi@test.com",
    notes: "Test",
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };

  const { data, error } = await supabase.from("bookings").insert(payload).select();
  if (error) {
    console.log(`Status '${statusVal}': ❌ Error (${error.message})`);
  } else {
    console.log(`Status '${statusVal}': ✅ SUCCESS! Created ID ${data[0].id}`);
    await supabase.from("bookings").delete().eq("id", data[0].id);
  }
}
