import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { ideaId, signalType, points } = await req.json();

    // Create signal
    const { data: signal, error: signalError } = await supabase
      .from('signals')
      .insert({
        user_id: user.id,
        idea_id: ideaId,
        signal_type: signalType,
        points: points || 1
      })
      .select()
      .single();

    if (signalError) {
      console.error('Signal creation error:', signalError);
      throw signalError;
    }

    // Update idea vote count
    const { error: updateError } = await supabase.rpc('increment_signal_points', {
      _user_id: user.id,
      _amount: points || 1
    });

    if (updateError) {
      console.error('Signal points update error:', updateError);
    }

    // Get updated idea
    const { data: idea } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', ideaId)
      .single();

    console.log('Signal created successfully:', signal.id);

    return new Response(JSON.stringify({ signal, idea }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in create-signal function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
