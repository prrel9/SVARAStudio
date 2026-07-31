import { Studio } from "@/lib/types";

export type SlotStatus = "available" | "booked" | "unavailable";

export interface TimeSlotData {
  hour: number; // 8 through 22
  status: SlotStatus;
}

export interface StudioSchedule {
  studioId: string;
  date: string; // YYYY-MM-DD
  slots: TimeSlotData[];
}

export interface SelectedSlot {
  studioId: string;
  studioName: string;
  hour: number;
  pricePerHour: number;
}

// Opening and closing hours
export const OPENING_HOUR = 8;
export const CLOSING_HOUR = 22;

// Helper to generate a date string from an offset
export function getDateString(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

// Deterministic "random" booked slots seeded by studioId + date + hour
// This keeps the mock data consistent across renders
function seedRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) / 2147483647;
}

export interface BookedSlotRange {
  studioId: string;
  startHour: number;
  endHour: number;
}

function generateSlots(
  studioId: string,
  date: string,
  bookedSlots: BookedSlotRange[] = []
): TimeSlotData[] {
  const slots: TimeSlotData[] = [];

  for (let hour = OPENING_HOUR; hour <= CLOSING_HOUR; hour++) {
    // Check if this hour is covered by a real DB booking
    const isRealBooked = bookedSlots.some(
      (b) => b.studioId === studioId && hour >= b.startHour && hour < b.endHour
    );

    if (isRealBooked) {
      slots.push({ hour, status: "booked" });
      continue;
    }

    const seed = `${studioId}-${date}-${hour}`;
    const rand = seedRandom(seed);

    let status: SlotStatus = "available";

    // ~30% chance of being booked, ~5% unavailable (maintenance)
    if (rand < 0.30) {
      status = "booked";
    } else if (rand < 0.35) {
      status = "unavailable";
    }

    slots.push({ hour, status });
  }

  return slots;
}

// Build a full schedule for all studios for a given date
export function buildScheduleForDate(
  date: string,
  studios: Studio[],
  bookedSlots: BookedSlotRange[] = []
): StudioSchedule[] {
  return studios.map((studio) => ({
    studioId: studio.id,
    date,
    slots: generateSlots(studio.id, date, bookedSlots),
  }));
}

// Format hour to display label: 8 → "08:00"
export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

// Calculate total price from duration
export function calculatePrice(
  pricePerHour: number,
  durationHours: number
): number {
  return pricePerHour * durationHours;
}

// Format IDR currency
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Generate next 7 days for date picker
export const AVAILABLE_DATES = Array.from({ length: 7 }, (_, i) => ({
  value: getDateString(i),
  label: new Date(getDateString(i)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }),
  isToday: i === 0,
}));
