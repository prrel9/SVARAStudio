-- =============================================
-- 005_studios_add_badge.sql
-- Fauls House Studio — Add missing columns to studios
-- Run this in your Supabase SQL Editor
-- =============================================

-- Add badge column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'studios'
      AND column_name  = 'badge'
  ) THEN
    ALTER TABLE public.studios ADD COLUMN badge TEXT DEFAULT '';
  END IF;
END $$;

-- Add is_active column if it doesn't exist (some installs use is_available instead)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'studios'
      AND column_name  = 'is_active'
  ) THEN
    ALTER TABLE public.studios ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;

-- Add equipment_level column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'studios'
      AND column_name  = 'equipment_level'
  ) THEN
    ALTER TABLE public.studios ADD COLUMN equipment_level TEXT DEFAULT 'Standard';
  END IF;
END $$;

-- Add room_size column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'studios'
      AND column_name  = 'room_size'
  ) THEN
    ALTER TABLE public.studios ADD COLUMN room_size TEXT DEFAULT '';
  END IF;
END $$;

-- Add capacity column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'studios'
      AND column_name  = 'capacity'
  ) THEN
    ALTER TABLE public.studios ADD COLUMN capacity INTEGER DEFAULT 0;
  END IF;
END $$;

-- Refresh Supabase schema cache (required after ALTER TABLE)
NOTIFY pgrst, 'reload schema';
