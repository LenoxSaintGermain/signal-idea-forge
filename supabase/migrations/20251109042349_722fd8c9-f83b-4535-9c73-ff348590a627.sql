-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  signal_points INTEGER DEFAULT 0 NOT NULL,
  ideas_submitted INTEGER DEFAULT 0 NOT NULL,
  ideas_voted INTEGER DEFAULT 0 NOT NULL,
  total_equity DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Create ideas table
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  market_opportunity TEXT,
  business_model TEXT,
  tags TEXT[] DEFAULT '{}',
  valuation_estimate INTEGER DEFAULT 0 NOT NULL,
  vote_count INTEGER DEFAULT 0 NOT NULL,
  comment_count INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('hot', 'trending', 'rising', 'new')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Ideas policies
CREATE POLICY "Ideas are viewable by everyone"
ON public.ideas FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create ideas"
ON public.ideas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
ON public.ideas FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
ON public.ideas FOR DELETE
USING (auth.uid() = user_id);

-- Create signals table
CREATE TABLE public.signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vote', 'comment', 'enhancement', 'submission')),
  points INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- Signals policies
CREATE POLICY "Signals are viewable by everyone"
ON public.signals FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create signals"
ON public.signals FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
ON public.comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON public.comments FOR DELETE
USING (auth.uid() = user_id);

-- Create idea_equity table
CREATE TABLE public.idea_equity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  equity_percentage DECIMAL(5, 2) DEFAULT 0 NOT NULL,
  signal_points_contributed INTEGER DEFAULT 0 NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, idea_id)
);

ALTER TABLE public.idea_equity ENABLE ROW LEVEL SECURITY;

-- Idea equity policies
CREATE POLICY "Idea equity is viewable by everyone"
ON public.idea_equity FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create equity records"
ON public.idea_equity FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equity records"
ON public.idea_equity FOR UPDATE
USING (auth.uid() = user_id);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend')),
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view own transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create transactions"
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment signal points
CREATE OR REPLACE FUNCTION public.increment_signal_points(_user_id UUID, _amount INTEGER)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET signal_points = signal_points + _amount
  WHERE id = _user_id;
END;
$$;

-- Function to calculate idea valuation based on signals
CREATE OR REPLACE FUNCTION public.calculate_idea_valuation(_idea_id UUID)
RETURNS INTEGER
LANGUAGE PLPGSQL
STABLE
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

-- Function to get user portfolio
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

-- Function to get trending ideas
CREATE OR REPLACE FUNCTION public.get_trending_ideas(_timeframe INTERVAL DEFAULT '7 days')
RETURNS TABLE (
  idea_id UUID,
  title TEXT,
  vote_count INTEGER,
  recent_signals INTEGER
)
LANGUAGE PLPGSQL
STABLE
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

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.signals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;