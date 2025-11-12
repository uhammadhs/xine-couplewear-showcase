-- Create couples table for customer couple goals
CREATE TABLE public.couples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_names TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchases table to track product purchases and points
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add points_value to products table
ALTER TABLE public.products ADD COLUMN points_value INTEGER DEFAULT 10;

-- Enable RLS
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for couples
CREATE POLICY "Everyone can view public couples"
ON public.couples FOR SELECT
USING (is_public = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage couples"
ON public.couples FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for purchases
CREATE POLICY "Everyone can view purchases"
ON public.purchases FOR SELECT
USING (true);

CREATE POLICY "Admins can manage purchases"
ON public.purchases FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to update couple ranking
CREATE OR REPLACE FUNCTION public.update_couple_rankings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update ranks based on total_points
  WITH ranked_couples AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY total_points DESC, created_at ASC) as new_rank
    FROM public.couples
    WHERE is_public = true
  )
  UPDATE public.couples
  SET rank = ranked_couples.new_rank
  FROM ranked_couples
  WHERE couples.id = ranked_couples.id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update rankings when couples data changes
CREATE TRIGGER update_couple_rankings_trigger
AFTER INSERT OR UPDATE OF total_points OR DELETE ON public.couples
FOR EACH STATEMENT
EXECUTE FUNCTION public.update_couple_rankings();

-- Trigger to update updated_at
CREATE TRIGGER update_couples_updated_at
BEFORE UPDATE ON public.couples
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_couples_rank ON public.couples(rank) WHERE is_public = true;
CREATE INDEX idx_couples_points ON public.couples(total_points DESC);
CREATE INDEX idx_purchases_couple ON public.purchases(couple_id);
CREATE INDEX idx_purchases_product ON public.purchases(product_id);