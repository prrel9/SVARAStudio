// Quick diagnostic: check if bookings table exists and test service role key
// Run: node scripts/check-db.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env manually
const envFile = readFileSync(join(__dirname, "../.env.local"), "utf-8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error("❌ Missing SUPABASE URL or SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

console.log("🔍 Checking Supabase connection...");
console.log("   URL:", URL);

// Test 1: Check bookings table
const { data: bookings, error: bookingsErr } = await supabase
  .from("bookings")
  .select("id")
  .limit(1);

if (bookingsErr) {
  console.log("\n❌ bookings table error:", bookingsErr.message);
  console.log("\n👉 FIX: Run the migration in Supabase SQL Editor:");
  console.log("   1. Open https://supabase.com/dashboard");
  console.log("   2. Go to your project → SQL Editor");
  console.log("   3. Paste and run: supabase/migrations/001_booking_system.sql");
} else {
  console.log("\n✅ bookings table exists. Rows found:", bookings?.length ?? 0);
}

// Test 2: Check payments table
const { data: payments, error: paymentsErr } = await supabase
  .from("payments")
  .select("id")
  .limit(1);

if (paymentsErr) {
  console.log("❌ payments table error:", paymentsErr.message);
} else {
  console.log("✅ payments table exists. Rows found:", payments?.length ?? 0);
}

// Test 3: Check storage bucket
const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
if (bucketErr) {
  console.log("❌ Storage error:", bucketErr.message);
} else {
  const bucket = buckets?.find((b) => b.name === "payment-proofs");
  if (bucket) {
    console.log("✅ payment-proofs storage bucket exists");
  } else {
    console.log("❌ payment-proofs bucket NOT found");
    console.log("   Available buckets:", buckets?.map((b) => b.name).join(", ") || "(none)");
    console.log("\n👉 FIX: Run in SQL Editor:");
    console.log(`   INSERT INTO storage.buckets (id, name, public)
   VALUES ('payment-proofs', 'payment-proofs', true)
   ON CONFLICT (id) DO NOTHING;`);
  }
}
