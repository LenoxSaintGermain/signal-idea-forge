import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PortfolioItem {
  idea_id: string;
  idea_title: string;
  equity_percentage: number;
  signal_points: number;
  current_valuation: number;
}

export const useUserPortfolio = (userId: string | undefined) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_user_portfolio', {
          _user_id: userId
        });

        if (error) throw error;
        setPortfolio(data || []);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        toast({
          title: 'Error loading portfolio',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [userId]);

  return { portfolio, loading };
};
