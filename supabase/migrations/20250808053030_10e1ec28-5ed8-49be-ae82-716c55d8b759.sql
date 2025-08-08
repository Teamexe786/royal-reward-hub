-- Add missing columns to access_attempts table for complete user data tracking
ALTER TABLE public.access_attempts ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.access_attempts ADD COLUMN IF NOT EXISTS player_level TEXT;
ALTER TABLE public.access_attempts ADD COLUMN IF NOT EXISTS player_uid TEXT;