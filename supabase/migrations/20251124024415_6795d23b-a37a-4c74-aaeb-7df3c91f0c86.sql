-- Create function to update couple points when purchase is made
CREATE OR REPLACE FUNCTION public.update_couple_points_on_purchase()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add points to couple's total
  UPDATE public.couples
  SET total_points = total_points + NEW.points_earned
  WHERE id = NEW.couple_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update points on purchase insert
CREATE TRIGGER trigger_update_couple_points
AFTER INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_couple_points_on_purchase();

-- Create trigger to update rankings when couple points change
CREATE TRIGGER trigger_update_rankings
AFTER UPDATE OF total_points ON public.couples
FOR EACH STATEMENT
EXECUTE FUNCTION public.update_couple_rankings();

-- Create trigger to update rankings when couple visibility changes
CREATE TRIGGER trigger_update_rankings_on_visibility
AFTER UPDATE OF is_public ON public.couples
FOR EACH STATEMENT
EXECUTE FUNCTION public.update_couple_rankings();