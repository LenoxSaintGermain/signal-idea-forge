-- Fix function search_path mutable warnings by setting search_path on all functions

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Update calculate_idea_valuation function
CREATE OR REPLACE FUNCTION public.calculate_idea_valuation(_idea_id UUID)
RETURNS INTEGER
LANGUAGE PLPGSQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_points INTEGER;
  base_valuation INTEGER := 100000;
BEGIN
  SELECT COALESCE(SUM(points), 0)
  INTO total_points
  FROM public.signals
  WHERE idea_id = _idea_id;
  
  RETURN base_valuation + (total_points * 1000);
END;
$$;

-- Update get_user_portfolio function
CREATE OR REPLACE FUNCTION public.get_user_portfolio(_user_id UUID)
RETURNS TABLE (
  idea_id UUID,
  idea_title TEXT,
  equity_percentage DECIMAL,
  signal_points INTEGER,
  current_valuation INTEGER
)
LANGUAGE PLPGSQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ie.idea_id,
    i.title,
    ie.equity_percentage,
    ie.signal_points_contributed,
    i.valuation_estimate
  FROM public.idea_equity ie
  JOIN public.ideas i ON ie.idea_id = i.id
  WHERE ie.user_id = _user_id
  ORDER BY ie.last_updated DESC;
END;
$$;

-- Update get_trending_ideas function
CREATE OR REPLACE FUNCTION public.get_trending_ideas(_timeframe INTERVAL DEFAULT '7 days')
RETURNS TABLE (
  idea_id UUID,
  title TEXT,
  vote_count INTEGER,
  recent_signals INTEGER
)
LANGUAGE PLPGSQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.title,
    i.vote_count,
    COUNT(s.id)::INTEGER as recent_signals
  FROM public.ideas i
  LEFT JOIN public.signals s ON i.id = s.idea_id 
    AND s.created_at > NOW() - _timeframe
  GROUP BY i.id, i.title, i.vote_count
  ORDER BY recent_signals DESC, i.vote_count DESC
  LIMIT 20;
END;
$$;

-- Add RLS policy for user_roles table
CREATE POLICY "User roles are viewable by everyone"
ON public.user_roles FOR SELECT
USING (true);