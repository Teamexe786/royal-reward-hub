-- Update RLS policy to allow viewing access attempts without authentication for admin purposes
DROP POLICY IF EXISTS "Authenticated users can view access attempts" ON access_attempts;

-- Create a new policy that allows viewing access attempts without authentication
-- since the admin panel has its own access key authentication
CREATE POLICY "Allow viewing access attempts for admin" 
ON access_attempts 
FOR SELECT 
USING (true);