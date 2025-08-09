-- Clear all existing attempts to start fresh
DELETE FROM access_attempts;

-- Add status column with default 'pending' if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_attempts' AND column_name = 'status') THEN
        ALTER TABLE access_attempts ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Update status column to have default 'pending'
ALTER TABLE access_attempts ALTER COLUMN status SET DEFAULT 'pending';