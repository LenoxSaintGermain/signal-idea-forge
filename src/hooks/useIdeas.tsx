import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import type { Idea } from '@/modules/signal-vault/types';

type DatabaseIdea = Database['public']['Tables']['ideas']['Row'];

const mapDatabaseIdea = (dbIdea: DatabaseIdea): Idea => ({
  id: dbIdea.id,
  title: dbIdea.title,
  summary: dbIdea.summary,
  problem: dbIdea.problem || undefined,
  solution: dbIdea.solution || undefined,
  marketOpportunity: dbIdea.market_opportunity || undefined,
  businessModel: dbIdea.business_model || undefined,
  tags: dbIdea.tags || [],
  valuationEstimate: dbIdea.valuation_estimate,
  voteCount: dbIdea.vote_count,
  commentCount: dbIdea.comment_count,
  status: (dbIdea.status as 'hot' | 'trending' | 'rising' | 'new') || 'new',
  createdAt: dbIdea.created_at ? new Date(dbIdea.created_at) : undefined,
  updatedAt: dbIdea.updated_at ? new Date(dbIdea.updated_at) : undefined,
});
export const useIdeas = (
  sortBy = 'popular', 
  categoryFilter = 'all', 
  statusFilter = 'all',
  valuationRange = 'all',
  limit = 50,
  offset = 0
) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ideas')
        .select('*', { count: 'exact' });

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply valuation range filter
      switch (valuationRange) {
        case '0-500k':
          query = query.gte('valuation_estimate', 0).lte('valuation_estimate', 500000);
          break;
        case '500k-1m':
          query = query.gte('valuation_estimate', 500000).lte('valuation_estimate', 1000000);
          break;
        case '1m-5m':
          query = query.gte('valuation_estimate', 1000000).lte('valuation_estimate', 5000000);
          break;
        case '5m+':
          query = query.gte('valuation_estimate', 5000000);
          break;
      }

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          query = query.order('vote_count', { ascending: false });
          break;
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'hot':
          query = query.eq('status', 'hot').order('vote_count', { ascending: false });
          break;
        case 'trending':
          query = query.eq('status', 'trending').order('vote_count', { ascending: false });
          break;
        default:
          query = query.order('vote_count', { ascending: false });
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      
      const mappedIdeas = (data || []).map(mapDatabaseIdea);
      setIdeas(offset === 0 ? mappedIdeas : prev => [...prev, ...mappedIdeas]);
      setHasMore((count || 0) > offset + limit);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: 'Error loading ideas',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('ideas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas'
        },
        () => {
          fetchIdeas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sortBy, categoryFilter, statusFilter, valuationRange, limit, offset]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchIdeas();
    }
  };

  return { ideas, loading, hasMore, refetch: fetchIdeas, loadMore };
};
