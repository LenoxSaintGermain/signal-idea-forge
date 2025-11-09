import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ActivityItem {
  id: string;
  type: string;
  ideaTitle: string;
  points: number;
  timestamp: Date;
}

export const useUserActivity = (userId: string | undefined) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('signals')
          .select(`
            id,
            type,
            points,
            created_at,
            idea_id,
            ideas!inner(title)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const formattedActivities = data?.map((signal: any) => ({
          id: signal.id,
          type: signal.type,
          ideaTitle: signal.ideas.title,
          points: signal.points,
          timestamp: new Date(signal.created_at)
        })) || [];

        setActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast({
          title: 'Error loading activity',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Real-time subscription
    const channel = supabase
      .channel(`user-activity-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signals',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { activities, loading };
};
