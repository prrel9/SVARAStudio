// Run the ALTER TABLE migration directly via Supabase
// Run: node scripts/run-migration.mjs

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

// Run each ALTER statement individually via rpc
const statements = [
  `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_code TEXT`,
  `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration_hours INTEGER NOT NULL DEFAULT 1`,
  `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS whatsapp TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS email TEXT`,
  `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_overlap ON public.bookings (studio_id, booking_date, booking_status)`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.bookings (booking_code)`,
];

console.log("Running ALTER TABLE migrations...\n");

for (const sql of statements) {
  const { error } = await supabase.rpc("exec_sql", { sql }).maybeSingle();
  // Note: exec_sql RPC may not exist; fallback will be shown below
  if (error && error.message.includes("exec_sql")) {
    console.log("⚠️  exec_sql RPC not available. Please run 002_alter_bookings_add_columns.sql manually in Supabase SQL Editor.");
    break;
  } else if (error) {
    console.log(`❌ Error: ${sql.substring(0, 60)}...`);
    console.log(`   ${error.message}`);
  } else {
    console.log(`✅ ${sql.substring(0, 60)}...`);
  }
}

// Verify columns now exist
console.log("\nVerifying columns...");
const cols = ["duration_hours", "full_name", "whatsapp", "expires_at"];
for (const col of cols) {
  const { error } = await supabase.from("bookings").select(col).limit(1);
  console.log(`  ${col}: ${error ? "❌ " + error.message : "✅ exists"}`);
}
