-- =============================================
-- 004_admin_profiles.sql
-- Fauls House Studio — Admin Profiles & Role Check
-- Run this in your Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  role        TEXT NOT NULL DEFAULT 'admin',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own profile
DROP POLICY IF EXISTS "Allow users to read own admin profile" ON public.admin_profiles;
CREATE POLICY "Allow users to read own admin profile"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Service role full access
DROP POLICY IF EXISTS "Service role full access admin_profiles" ON public.admin_profiles;
CREATE POLICY "Service role full access admin_profiles"
  ON public.admin_profiles FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
