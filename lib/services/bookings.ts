import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Booking, BookingStatus } from "@/lib/types";

/** Statuses that count as "active" for overlap detection */
const ACTIVE_STATUSES: BookingStatus[] = [
  "pending_payment",
  "waiting_verification",
  "confirmed",
];

/** Generate a unique booking code like FH-A3B7K2XP */
function generateBookingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FH-${code}`;
}

/** Convert hour integer to HH:MM string */
function hourToTime(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

// ─── Overlap Check ───────────────────────────────────────────────────────────

interface OverlapCheckParams {
  studioId: string;
  bookingDate: string;  // YYYY-MM-DD
  startHour: number;
  endHour: number;      // exclusive (startHour + durationHours)
}

/**
 * Returns true if there is at least one conflicting active booking.
 * Overlap condition: existing.start_time < newEnd AND existing.end_time > newStart
 */
export async function checkOverlap(params: OverlapCheckParams): Promise<boolean> {
  const supabase = createAdminSupabaseClient();
  const { studioId, bookingDate, startHour, endHour } = params;
  const newStart = hourToTime(startHour);
  const newEnd = hourToTime(endHour);

  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("studio_id", studioId)
    .eq("booking_date", bookingDate)
    .in("booking_status", ACTIVE_STATUSES)
    .lt("start_time", newEnd)
    .gt("end_time", newStart);

  if (error) {
    console.error("checkOverlap error:", error);
    // Fail safe: treat as overlap to prevent double-booking
    return true;
  }

  return (data?.length ?? 0) > 0;
}

// ─── Create Booking ───────────────────────────────────────────────────────────

export interface CreateBookingInput {
  studioId: string;
  bookingDate: string;
  startHour: number;
  durationHours: number;
  totalPrice: number;
  fullName: string;
  whatsapp: string;
  email?: string;
  notes?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const supabase = createAdminSupabaseClient();

  const endHour = input.startHour + input.durationHours;
  const startTime = hourToTime(input.startHour);
  const endTime = hourToTime(endHour);

  // Generate unique booking code (retry on collision)
  let bookingCode = generateBookingCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_code", bookingCode)
      .maybeSingle();
    if (!existing) break;
    bookingCode = generateBookingCode();
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      booking_code: bookingCode,
      studio_id: input.studioId,
      booking_date: input.bookingDate,
      start_time: startTime,
      end_time: endTime,
      duration_hours: input.durationHours,
      total_price: input.totalPrice,
      booking_status: "pending_payment",
      full_name: input.fullName,
      whatsapp: input.whatsapp,
      customer_name: input.fullName,
      customer_phone: input.whatsapp,
      email: input.email ?? null,
      notes: input.notes ?? null,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createBooking error:", error);
    throw new Error(error?.message ?? "Failed to create booking");
  }

  return mapBookingRow(data);
}

// ─── Fetch Booking ────────────────────────────────────────────────────────────

export async function getBookingByCode(code: string): Promise<Booking | null> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*, payments(*)")
    .eq("booking_code", code)
    .maybeSingle();

  if (error || !data) return null;

  const booking = mapBookingRow(data);
  if (data.payments && data.payments.length > 0) {
    const p = data.payments[0];
    booking.payment = {
      id: p.id,
      bookingId: p.booking_id,
      proofUrl: p.proof_url,
      paymentStatus: p.payment_status,
      rejectionReason: p.rejection_reason ?? undefined,
      verifiedBy: p.verified_by ?? undefined,
      verifiedAt: p.verified_at ?? undefined,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
  }
  return booking;
}

// ─── Get Booked Slots for a Studio+Date ──────────────────────────────────────

export interface BookedSlot {
  startHour: number;
  endHour: number;
}

export async function getBookedSlots(
  studioId: string,
  date: string
): Promise<BookedSlot[]> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("start_time, end_time")
    .eq("studio_id", studioId)
    .eq("booking_date", date)
    .in("booking_status", ACTIVE_STATUSES);

  if (error || !data) return [];

  return data.map((row) => ({
    startHour: parseInt(row.start_time.split(":")[0]),
    endHour: parseInt(row.end_time.split(":")[0]),
  }));
}

// ─── Admin Bookings Management ────────────────────────────────────────────────

export async function getAllBookingsAdmin(): Promise<Booking[]> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*, payments(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const booking = mapBookingRow(row);
    if (row.payments && row.payments.length > 0) {
      const p = row.payments[row.payments.length - 1];
      booking.payment = {
        id: p.id,
        bookingId: p.booking_id,
        proofUrl: p.proof_url,
        paymentStatus: p.payment_status,
        rejectionReason: p.rejection_reason ?? undefined,
        verifiedBy: p.verified_by ?? undefined,
        verifiedAt: p.verified_at ?? undefined,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    }
    return booking;
  });
}

export async function updateBookingStatusAdmin(
  bookingId: string,
  newStatus: BookingStatus
): Promise<void> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("bookings")
    .update({ booking_status: newStatus })
    .eq("id", bookingId);

  if (error) throw new Error(error.message);
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBookingRow(row: any): Booking {
  return {
    id: row.id,
    bookingCode: row.booking_code,
    studioId: row.studio_id,
    bookingDate: row.booking_date,
    startTime: row.start_time,
    endTime: row.end_time,
    durationHours: row.duration_hours,
    totalPrice: Number(row.total_price),
    bookingStatus: row.booking_status,
    fullName: row.full_name || row.customer_name || "",
    whatsapp: row.whatsapp || row.customer_phone || "",
    email: row.email ?? undefined,
    notes: row.notes ?? undefined,
    expiresAt: row.expires_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
