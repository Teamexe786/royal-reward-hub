-- Enable realtime for items table
ALTER TABLE public.items REPLICA IDENTITY FULL;

-- Add items table to realtime publication
ALTER publication supabase_realtime ADD TABLE public.items;