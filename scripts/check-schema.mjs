// Check schema and fix studio_id type
// Run: node scripts/check-schema.mjs

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

// Check what type studios.id is
console.log("Checking studios.id type...");
const { data: studioRows, error: studioErr } = await supabase
  .from("studios")
  .select("id")
  .limit(3);

if (studioErr) {
  console.log("studios error:", studioErr.message);
} else {
  console.log("studios.id samples:", studioRows?.map(r => r.id));
}

// Test UUID query on bookings
console.log("\nTesting UUID query on bookings...");
const { error: uuidErr } = await supabase
  .from("bookings")
  .select("id")
  .eq("studio_id", "00000000-0000-0000-0000-000000000000")
  .limit(1);
console.log("UUID query result:", uuidErr?.message ?? "✅ accepts UUID");

// Test text query on bookings  
console.log("\nTesting TEXT query on bookings...");
const { error: textErr } = await supabase
  .from("bookings")
  .select("id")
  .eq("studio_id", "some-text-id")
  .limit(1);
console.log("TEXT query result:", textErr?.message ?? "✅ accepts text");
