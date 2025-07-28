-- Check if policies exist and drop them properly
DROP POLICY IF EXISTS "Allow admin to insert items" ON public.items;
DROP POLICY IF EXISTS "Allow admin to update items" ON public.items;
DROP POLICY IF EXISTS "Allow admin to delete items" ON public.items;

-- Now recreate them
CREATE POLICY "Allow admin to insert items" 
ON public.items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admin to update items"
ON public.items
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow admin to delete items"
ON public.items
FOR DELETE
USING (true);