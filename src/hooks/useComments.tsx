import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Comment = Database['public']['Tables']['comments']['Row'];

export const useComments = (ideaId: string | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!ideaId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error loading comments',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    if (!ideaId) return;

    // Subscribe to real-time comment updates
    const channel = supabase
      .channel(`comments-${ideaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `idea_id=eq.${ideaId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ideaId]);

  const addComment = async (content: string, userName: string) => {
    if (!ideaId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          idea_id: ideaId,
          user_id: user.id,
          user_name: userName,
          content
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Comment added',
        description: '+2 Signal Points earned',
      });

      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error adding comment',
        description: 'Please try again',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return { comments, loading, addComment, refetch: fetchComments };
};
