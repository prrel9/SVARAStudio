// Create payment-proofs storage bucket
// Run: node scripts/create-bucket.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envFile = readFileSync(join(__dirname, "../.env.local"), "utf-8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

console.log("Creating payment-proofs bucket...");

const { data, error } = await supabase.storage.createBucket("payment-proofs", {
  public: true,
  fileSizeLimit: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
});

if (error) {
  console.error("❌ Error:", error.message);
} else {
  console.log("✅ Bucket created:", data);
}
