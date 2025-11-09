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

    const { ideaId, investmentAmount, exitMultiple, timeframe } = await req.json();

    // Get idea equity for user
    const { data: equity, error: equityError } = await supabase
      .from('idea_equity')
      .select('equity_percentage')
      .eq('idea_id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (equityError && equityError.code !== 'PGRST116') {
      console.error('Equity fetch error:', equityError);
      throw equityError;
    }

    const equityPercentage = equity?.equity_percentage || 0;

    // Get idea valuation
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('valuation_estimate')
      .eq('id', ideaId)
      .single();

    if (ideaError) {
      console.error('Idea fetch error:', ideaError);
      throw ideaError;
    }

    const currentValuation = idea.valuation_estimate;
    const exitValuation = currentValuation * exitMultiple;
    const potentialReturn = exitValuation * (equityPercentage / 100);
    const roi = ((potentialReturn - investmentAmount) / investmentAmount) * 100;
    const annualizedReturn = (Math.pow(1 + (roi / 100), 1 / timeframe) - 1) * 100;

    const roiData = {
      currentValuation,
      exitValuation,
      equityPercentage,
      investmentAmount,
      potentialReturn,
      roi,
      annualizedReturn,
      timeframe
    };

    console.log('ROI calculated successfully for idea:', ideaId);

    return new Response(JSON.stringify(roiData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in calculate-roi function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
