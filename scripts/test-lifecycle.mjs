// Test full lifecycle: booking -> payment upload -> admin approve
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

console.log("--- Step 1: Create Booking ---");
const bookRes = await fetch("http://localhost:3000/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    studioId,
    bookingDate: "2026-09-01",
    startHour: 15,
    durationHours: 2,
    totalPrice: 400000,
    fullName: "Full Lifecycle User",
    whatsapp: "081299998888",
    email: "lifecycle@test.com",
    notes: "Lifecycle test",
  }),
});
const booking = await bookRes.json();
console.log("Created booking:", booking);

console.log("\n--- Step 2: Upload Payment Proof ---");
// Create dummy image file
const dummyFile = new Blob(["dummy payment proof content"], { type: "image/png" });
const fd = new FormData();
fd.append("file", dummyFile, "proof.png");
fd.append("bookingId", booking.id);

const payRes = await fetch("http://localhost:3000/api/payments/upload", {
  method: "POST",
  body: fd,
});
const payment = await payRes.json();
console.log("Created payment:", payment);

console.log("\n--- Step 3: Admin Approve ---");
const appRes = await fetch(`http://localhost:3000/api/admin/payments/${payment.paymentId}/approve`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ verifiedBy: "admin-tester" }),
});
const approveResult = await appRes.json();
console.log("Approve result:", approveResult);

// Verify booking is confirmed
const { data: bRow } = await supabase.from("bookings").select("booking_status").eq("id", booking.id).single();
console.log("Final booking status:", bRow?.booking_status);
console.log(bRow?.booking_status === "confirmed" ? "✅ FULL LIFECYCLE SUCCESSFUL!" : "❌ Status not confirmed");

// Cleanup
await supabase.from("payments").delete().eq("id", payment.paymentId);
await supabase.from("bookings").delete().eq("id", booking.id);
console.log("\nCleaned up test data.");
