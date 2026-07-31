// Test the /api/bookings POST endpoint directly
// Run: node scripts/test-booking-api.mjs

const BASE = "http://localhost:3000";

const payload = {
  studioId: "test-studio-1",
  bookingDate: "2026-07-30",
  startHour: 10,
  durationHours: 2,
  totalPrice: 200000,
  fullName: "Test User",
  whatsapp: "08123456789",
  email: "test@example.com",
  notes: "Test booking",
};

console.log("Testing POST /api/bookings...");
console.log("Payload:", JSON.stringify(payload, null, 2));

try {
  const res = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log("\nStatus:", res.status);
  try {
    const json = JSON.parse(text);
    console.log("Response:", JSON.stringify(json, null, 2));
  } catch {
    console.log("Raw response:", text);
  }
} catch (err) {
  console.error("Fetch error:", err.message);
}
