import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Payment } from "@/lib/types";

// ─── Create Payment ───────────────────────────────────────────────────────────

export async function createPayment(
  bookingId: string,
  proofUrl: string
): Promise<Payment> {
  const supabase = createAdminSupabaseClient();

  // Update booking status to waiting_verification
  await supabase
    .from("bookings")
    .update({ booking_status: "waiting_verification" })
    .eq("id", bookingId);

  const { data, error } = await supabase
    .from("payments")
    .insert({
      booking_id: bookingId,
      proof_url: proofUrl,
      payment_status: "waiting_verification",
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createPayment error:", error);
    throw new Error(error?.message ?? "Failed to create payment");
  }

  return mapPaymentRow(data);
}

// ─── Get Payments for Admin ───────────────────────────────────────────────────

export interface AdminBookingInfo {
  bookingCode: string;
  fullName: string;
  whatsapp: string;
  studioId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

export interface PaymentWithBooking extends Omit<Payment, "booking"> {
  booking: AdminBookingInfo;
}

export async function getPaymentsPendingVerification(): Promise<
  PaymentWithBooking[]
> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*, bookings(*)")
    .eq("payment_status", "waiting_verification")
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("getPaymentsPendingVerification error:", error);
    return [];
  }

  return data.map((row) => {
    const b = row.bookings;
    return {
      ...mapPaymentRow(row),
      booking: {
        bookingCode: b.booking_code,
        fullName: b.full_name || b.customer_name || "",
        whatsapp: b.whatsapp || b.customer_phone || "",
        studioId: b.studio_id,
        bookingDate: b.booking_date,
        startTime: b.start_time,
        endTime: b.end_time,
        totalPrice: Number(b.total_price),
      },
    };
  });
}

// ─── Approve Payment ─────────────────────────────────────────────────────────

export async function approvePayment(
  paymentId: string,
  verifiedBy: string
): Promise<void> {
  const supabase = createAdminSupabaseClient();

  // Get booking_id first
  const { data: payment, error: fetchError } = await supabase
    .from("payments")
    .select("booking_id")
    .eq("id", paymentId)
    .single();

  if (fetchError || !payment) throw new Error("Payment not found");

  // Update payment
  const { error: payErr } = await supabase
    .from("payments")
    .update({
      payment_status: "verified",
      verified_by: verifiedBy,
      verified_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (payErr) throw new Error(payErr.message);

  // Update booking
  const { error: bookErr } = await supabase
    .from("bookings")
    .update({ booking_status: "confirmed" })
    .eq("id", payment.booking_id);

  if (bookErr) throw new Error(bookErr.message);
}

// ─── Reject Payment ───────────────────────────────────────────────────────────

export async function rejectPayment(
  paymentId: string,
  verifiedBy: string,
  reason: string
): Promise<void> {
  const supabase = createAdminSupabaseClient();

  const { data: payment, error: fetchError } = await supabase
    .from("payments")
    .select("booking_id")
    .eq("id", paymentId)
    .single();

  if (fetchError || !payment) throw new Error("Payment not found");

  const { error: payErr } = await supabase
    .from("payments")
    .update({
      payment_status: "rejected",
      rejection_reason: reason,
      verified_by: verifiedBy,
      verified_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (payErr) throw new Error(payErr.message);

  const { error: bookErr } = await supabase
    .from("bookings")
    .update({ booking_status: "rejected" })
    .eq("id", payment.booking_id);

  if (bookErr) throw new Error(bookErr.message);
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPaymentRow(row: any): Payment {
  return {
    id: row.id,
    bookingId: row.booking_id,
    proofUrl: row.proof_url,
    paymentStatus: row.payment_status,
    rejectionReason: row.rejection_reason ?? undefined,
    verifiedBy: row.verified_by ?? undefined,
    verifiedAt: row.verified_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
