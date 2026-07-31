// Check the actual column type of studio_id in bookings
// Run: node scripts/fix-schema.mjs

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

// studios.id samples are UUIDs — so bookings.studio_id must match
// The table was created with UUID type for studio_id (likely pre-existing table)
// We need to add missing columns that our migration added but may not exist

// Check which columns exist by trying to select them
console.log("Checking which columns exist in bookings...");

const columnsToCheck = [
  "id", "studio_id", "booking_date", "start_time", "end_time",
  "duration_hours", "total_price", "booking_status", "full_name",
  "whatsapp", "email", "notes", "expires_at", "created_at", "updated_at",
  "booking_code"
];

for (const col of columnsToCheck) {
  const { error } = await supabase
    .from("bookings")
    .select(col)
    .limit(1);
  const status = error ? `❌ MISSING (${error.message.split(":")[0]})` : "✅ exists";
  console.log(`  ${col}: ${status}`);
}
