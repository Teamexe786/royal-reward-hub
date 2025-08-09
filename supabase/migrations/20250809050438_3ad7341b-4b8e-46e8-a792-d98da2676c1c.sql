-- Fix the status check constraint to allow 'pending' status
ALTER TABLE access_attempts DROP CONSTRAINT IF EXISTS access_attempts_status_check;

-- Add new constraint that includes 'pending'
ALTER TABLE access_attempts ADD CONSTRAINT access_attempts_status_check 
CHECK (status = ANY (ARRAY['pending'::text, 'success'::text, 'failed'::text]));