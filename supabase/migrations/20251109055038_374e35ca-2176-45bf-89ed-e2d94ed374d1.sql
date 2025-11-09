-- Add database indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_ideas_status ON public.ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON public.ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_vote_count ON public.ideas(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_valuation ON public.ideas(valuation_estimate);
CREATE INDEX IF NOT EXISTS idx_ideas_tags ON public.ideas USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_signals_user_id ON public.signals(user_id);
CREATE INDEX IF NOT EXISTS idx_signals_idea_id ON public.signals(idea_id);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON public.signals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_idea_id ON public.comments(idea_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);