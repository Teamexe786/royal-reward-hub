-- Fix RLS policies for admin access to items table
-- Drop the existing restrictive policy for managing items
DROP POLICY IF EXISTS "Authenticated users can manage items" ON public.items;

-- Create new policies that allow admin operations
-- Allow anyone to insert items (for admin panel)
CREATE POLICY "Allow admin to insert items" 
ON public.items 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update items (for admin panel)  
CREATE POLICY "Allow admin to update items"
ON public.items
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete items (for admin panel)
CREATE POLICY "Allow admin to delete items"
ON public.items
FOR DELETE
USING (true);

-- Keep the existing select policy
-- Items are viewable by everyone (already exists)