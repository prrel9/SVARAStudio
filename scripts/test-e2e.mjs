// Test end-to-end booking flow with real studio ID
// Run: node scripts/test-e2e.mjs

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

// Get a real studio ID
const { data: studios } = await supabase.from("studios").select("id, name").limit(1);
const studio = studios?.[0];
if (!studio) { console.error("No studios found"); process.exit(1); }

console.log("Using studio:", studio.name, "(", studio.id, ")");

// Test 1: API booking
console.log("\n--- Test 1: POST /api/bookings ---");
const res = await fetch("http://localhost:3000/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    studioId: studio.id,
    bookingDate: "2026-08-10",
    startHour: 14,
    durationHours: 2,
    totalPrice: 300000,
    fullName: "Test Budi",
    whatsapp: "081234567890",
    email: "budi@test.com",
    notes: "E2E test booking",
  }),
});
const json = await res.json();
console.log("Status:", res.status);
console.log("Response:", JSON.stringify(json, null, 2));

if (res.status !== 200) {
  console.log("\n❌ Booking creation failed");
  process.exit(1);
}

const bookingId = json.id;
const bookingCode = json.bookingCode;
console.log("\n✅ Booking created:", bookingCode);

// Test 2: Overlap check (same slot should now fail)
console.log("\n--- Test 2: Overlap check (same slot) ---");
const res2 = await fetch("http://localhost:3000/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    studioId: studio.id,
    bookingDate: "2026-08-10",
    startHour: 15, // overlaps with 14:00-16:00
    durationHours: 1,
    totalPrice: 150000,
    fullName: "Test Overlap",
    whatsapp: "081111111111",
  }),
});
const json2 = await res2.json();
console.log("Status:", res2.status, "(expected 409)");
console.log("Response:", json2.error ?? json2);
console.log(res2.status === 409 ? "✅ Overlap detected correctly" : "❌ Overlap NOT detected");

// Test 3: Cleanup - delete test booking
const { error: delErr } = await supabase.from("bookings").delete().eq("id", bookingId);
console.log("\n--- Cleanup ---");
console.log(delErr ? "❌ Cleanup failed: " + delErr.message : "✅ Test booking deleted");
