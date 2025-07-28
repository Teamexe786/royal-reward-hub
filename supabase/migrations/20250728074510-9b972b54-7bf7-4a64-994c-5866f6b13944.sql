-- Update item 1 name and image
UPDATE items 
SET name = 'Hip-hop', 
    image_url = 'https://i.ibb.co/9k3wxygj/20250728-130718.png',
    updated_at = now()
WHERE id = 1;