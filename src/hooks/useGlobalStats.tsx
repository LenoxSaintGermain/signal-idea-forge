import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GlobalStats {
  totalIdeas: number;
  activeUsers: number;
  totalValuation: number;
  validationRate: number;
}

export const useGlobalStats = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalIdeas: 0,
    activeUsers: 0,
    totalValuation: 0,
    validationRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get total ideas count
      const { count: ideasCount } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true });

      // Get distinct users who have created signals
      const { data: signalsData } = await supabase
        .from('signals')
        .select('user_id');

      const uniqueUsers = new Set(signalsData?.map(s => s.user_id) || []).size;

      // Get sum of all valuations
      const { data: valuationsData } = await supabase
        .from('ideas')
        .select('valuation_estimate');

      const totalVal = valuationsData?.reduce((sum, idea) => sum + (idea.valuation_estimate || 0), 0) || 0;

      // Calculate validation rate (ideas with votes / total ideas)
      const { count: votedIdeasCount } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .gt('vote_count', 0);

      const validationRate = ideasCount ? ((votedIdeasCount || 0) / ideasCount) * 100 : 0;

      setStats({
        totalIdeas: ideasCount || 0,
        activeUsers: uniqueUsers,
        totalValuation: totalVal,
        validationRate: Math.round(validationRate)
      });
    } catch (error) {
      console.error('Error fetching global stats:', error);
      toast({
        title: 'Error loading stats',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Real-time subscription for ideas
    const channel = supabase
      .channel('global-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas'
        },
        () => {
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'signals'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading };
};
