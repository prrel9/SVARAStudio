-- =============================================
-- 002_alter_bookings_add_columns.sql
-- Fix legacy constraints on existing bookings table
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Drop existing status check constraint so 'pending_payment' & 'waiting_verification' are allowed
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_booking_status_check;

-- 2. Drop NOT NULL on legacy customer columns
ALTER TABLE public.bookings ALTER COLUMN customer_name DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN customer_phone DROP NOT NULL;

-- 3. Add missing columns to existing bookings table
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS booking_code    TEXT,
  ADD COLUMN IF NOT EXISTS duration_hours  INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS full_name       TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS email           TEXT,
  ADD COLUMN IF NOT EXISTS expires_at      TIMESTAMPTZ;

-- 4. Make booking_code unique if not already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'bookings_booking_code_key'
  ) THEN
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_booking_code_key UNIQUE (booking_code);
  END IF;
END $$;

-- 5. Add indexes for overlap check
CREATE INDEX IF NOT EXISTS idx_bookings_overlap
  ON public.bookings (studio_id, booking_date, booking_status);

CREATE INDEX IF NOT EXISTS idx_bookings_code
  ON public.bookings (booking_code);

-- 6. Create payments table if not exists
CREATE TABLE IF NOT EXISTS public.payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id       UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  proof_url        TEXT NOT NULL,
  payment_status   TEXT NOT NULL DEFAULT 'waiting_verification',
  rejection_reason TEXT,
  verified_by      TEXT,
  verified_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments (booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (payment_status);

-- 7. RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert payments" ON public.payments;
CREATE POLICY "Allow public insert payments"
  ON public.payments FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read payments" ON public.payments;
CREATE POLICY "Allow public read payments"
  ON public.payments FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Service role full access payments" ON public.payments;
CREATE POLICY "Service role full access payments"
  ON public.payments FOR ALL TO service_role USING (true) WITH CHECK (true);
