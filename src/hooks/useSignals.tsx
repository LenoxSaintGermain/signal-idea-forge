import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSignals = (userId: string | undefined) => {
  const [votedIdeas, setVotedIdeas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserVotes = async () => {
      try {
        const { data, error } = await supabase
          .from('signals')
          .select('idea_id')
          .eq('user_id', userId)
          .eq('type', 'vote');

        if (error) throw error;

        const votedSet = new Set(data?.map((signal) => signal.idea_id) || []);
        setVotedIdeas(votedSet);
      } catch (error) {
        console.error('Error fetching user votes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserVotes();
  }, [userId]);

  const createSignal = async (ideaId: string, signalType: 'vote' | 'comment' | 'enhancement' | 'submission', points: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-signal', {
        body: { ideaId, signalType, points }
      });

      if (error) throw error;

      // Update local state
      if (signalType === 'vote') {
        setVotedIdeas(prev => new Set([...prev, ideaId]));
      }

      return data;
    } catch (error) {
      console.error('Error creating signal:', error);
      toast({
        title: 'Error recording signal',
        description: 'Please try again',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return { votedIdeas, loading, createSignal };
};
