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

    const ideaData = await req.json();

    // Insert idea into database
    const { data: idea, error: insertError } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        title: ideaData.title,
        summary: ideaData.summary,
        problem_statement: ideaData.problem,
        solution_overview: ideaData.solution,
        target_market: ideaData.market,
        business_model: ideaData.businessModel,
        competitive_advantage: ideaData.competitiveAdvantage,
        revenue_strategy: ideaData.revenueStrategy,
        tags: ideaData.tags || [],
        valuation_estimate: ideaData.valuationEstimate || 100000,
        vote_count: 0,
        comment_count: 0,
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      throw insertError;
    }

    console.log('Idea created successfully:', idea.id);

    return new Response(JSON.stringify({ idea }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in submit-idea function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
