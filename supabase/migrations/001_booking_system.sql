-- =============================================
-- 001_booking_system.sql
-- Fauls House Studio — Booking System Tables
-- Run this in your Supabase SQL Editor
-- =============================================

-- ─────────────────────────────────────────────
-- BOOKINGS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code    TEXT NOT NULL UNIQUE,
  studio_id       TEXT NOT NULL,
  booking_date    DATE NOT NULL,
  start_time      TEXT NOT NULL,   -- e.g. "08:00"
  end_time        TEXT NOT NULL,   -- e.g. "10:00"
  duration_hours  INTEGER NOT NULL DEFAULT 1,
  total_price     NUMERIC(12,2) NOT NULL,
  booking_status  TEXT NOT NULL DEFAULT 'pending_payment',
    -- pending_payment | waiting_verification | confirmed | rejected | expired | cancelled
  full_name       TEXT NOT NULL,
  whatsapp        TEXT NOT NULL,
  email           TEXT,
  notes           TEXT,
  expires_at      TIMESTAMPTZ,     -- 15 min after creation for pending_payment
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for overlap check queries
CREATE INDEX IF NOT EXISTS idx_bookings_overlap
  ON public.bookings (studio_id, booking_date, booking_status);

-- Index for booking_code lookup
CREATE INDEX IF NOT EXISTS idx_bookings_code
  ON public.bookings (booking_code);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────
-- PAYMENTS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id       UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  proof_url        TEXT NOT NULL,
  payment_status   TEXT NOT NULL DEFAULT 'waiting_verification',
    -- waiting_verification | verified | rejected
  rejection_reason TEXT,
  verified_by      TEXT,           -- admin identifier
  verified_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id
  ON public.payments (booking_id);

CREATE INDEX IF NOT EXISTS idx_payments_status
  ON public.payments (payment_status);

DROP TRIGGER IF EXISTS payments_updated_at ON public.payments;
CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow public insert (guest booking, no auth required)
CREATE POLICY "Allow public insert bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public read own booking by code (for booking_code lookup)
CREATE POLICY "Allow public read bookings"
  ON public.bookings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow service_role full access
CREATE POLICY "Service role full access bookings"
  ON public.bookings FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert payments"
  ON public.payments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read payments"
  ON public.payments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role full access payments"
  ON public.payments FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────
-- STORAGE BUCKET FOR PAYMENT PROOFS
-- ─────────────────────────────────────────────
-- Run this separately if storage bucket doesn't exist:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('payment-proofs', 'payment-proofs', true)
-- ON CONFLICT (id) DO NOTHING;
