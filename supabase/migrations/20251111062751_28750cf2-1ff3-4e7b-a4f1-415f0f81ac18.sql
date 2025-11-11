-- Add multiple images support and purchase link to products table
ALTER TABLE public.products 
ADD COLUMN images jsonb DEFAULT '[]'::jsonb,
ADD COLUMN purchase_link text;

-- Add comment for clarity
COMMENT ON COLUMN public.products.images IS 'Array of image URLs for the product';
COMMENT ON COLUMN public.products.purchase_link IS 'Link to purchase page (WhatsApp, Shopee, etc)';

-- Update existing products to move single image to images array if exists
UPDATE public.products 
SET images = jsonb_build_array(jsonb_build_object('url', image_url, 'is_primary', true))
WHERE image_url IS NOT NULL AND image_url != '';