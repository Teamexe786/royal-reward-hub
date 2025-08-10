-- Check and fix RLS policies for access_attempts table
-- Drop existing policies
DROP POLICY IF EXISTS "Allow viewing access attempts for admin" ON access_attempts;
DROP POLICY IF EXISTS "Anyone can insert access attempts" ON access_attempts;

-- Create new policies that allow both insert and update
CREATE POLICY "Anyone can insert access attempts" 
ON access_attempts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update access attempts" 
ON access_attempts 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow viewing access attempts for admin" 
ON access_attempts 
FOR SELECT 
USING (true);