-- Create items table
CREATE TABLE public.items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('Legendary', 'Epic', 'Rare')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create access attempts table
CREATE TABLE public.access_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  passphrase TEXT NOT NULL,
  item_id INTEGER REFERENCES public.items(id),
  item_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed'))
);

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for items (public read, authenticated write)
CREATE POLICY "Items are viewable by everyone" 
ON public.items 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage items" 
ON public.items 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create policies for access attempts (authenticated read/write)
CREATE POLICY "Authenticated users can view access attempts" 
ON public.access_attempts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can insert access attempts" 
ON public.access_attempts 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON public.items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default items
INSERT INTO public.items (name, description, rarity, image_url) VALUES
('Royal Crown of Eternity', 'A legendary crown imbued with the power of ancient kings. Grants +50 Leadership and immunity to mind control.', 'Legendary', '/src/assets/crown.jpg'),
('Dragonbane Sword', 'Forged in dragon fire and blessed by the gods. Deals massive damage to all enemy types.', 'Legendary', '/src/assets/sword.jpg'),
('Aegis Shield of Valor', 'An unbreakable shield that has protected heroes throughout the ages. Reflects 25% of incoming damage.', 'Epic', '/src/assets/shield.jpg'),
('Amulet of Infinite Wisdom', 'Contains the knowledge of a thousand scholars. Increases experience gain by 100%.', 'Epic', '/src/assets/amulet.jpg'),
('Staff of Elemental Mastery', 'Channels the raw power of the elements. Unlocks all elemental magic schools.', 'Legendary', '/src/assets/staff.jpg'),
('Ring of Dimensional Storage', 'Provides unlimited inventory space across dimensions. Never lose items again.', 'Epic', '/src/assets/ring.jpg'),
('Helmet of True Sight', 'Reveals hidden enemies and secrets. See through illusions and detect invisible foes.', 'Rare', '/src/assets/helmet.jpg'),
('Gauntlets of Titan Strength', 'Channels the might of ancient titans. Increases carrying capacity and melee damage.', 'Epic', '/src/assets/gauntlets.jpg'),
('Boots of Swift Travel', 'Blessed by the wind spirits. Increases movement speed by 200% and enables wall-walking.', 'Rare', '/src/assets/boots.jpg'),
('Orb of Cosmic Power', 'Contains the essence of a fallen star. Regenerates mana infinitely and amplifies all spells.', 'Legendary', '/src/assets/orb.jpg');

-- Enable realtime
ALTER TABLE public.items REPLICA IDENTITY FULL;
ALTER TABLE public.access_attempts REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.access_attempts;