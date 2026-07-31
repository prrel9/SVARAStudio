-- =============================================
-- 003_settings_table.sql
-- Fauls House Studio — App Settings Table
-- Run this in your Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.settings (
  id          SERIAL PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at using a self-contained trigger function
CREATE OR REPLACE FUNCTION public.settings_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS settings_updated_at ON public.settings;
CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.settings_set_updated_at();

-- RLS: Only service_role can read/write (admin-only via API routes)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access settings" ON public.settings;
CREATE POLICY "Service role full access settings"
  ON public.settings FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Seed default settings (safe to re-run — ON CONFLICT DO NOTHING)
INSERT INTO public.settings (key, value) VALUES
  ('company_name',   'Fauls House Studio'),
  ('logo_url',       ''),
  ('hero_title',     'Where Your Sound Comes to Life'),
  ('hero_subtitle',  'Professional rehearsal studios, premium equipment, and an inspiring atmosphere.'),
  ('phone',          ''),
  ('whatsapp',       ''),
  ('address',        ''),
  ('bank_name',      ''),
  ('account_number', ''),
  ('account_holder', '')
ON CONFLICT (key) DO NOTHING;
