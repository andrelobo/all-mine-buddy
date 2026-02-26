const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { codigo_cnae, descricao } = await req.json();

    if (!codigo_cnae) {
      return new Response(
        JSON.stringify({ success: false, error: 'codigo_cnae é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'LOVABLE_API_KEY não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Você é um especialista em tributação brasileira do Simples Nacional.

Dado o CNAE ${codigo_cnae}${descricao ? ` (${descricao})` : ''}, responda APENAS com um JSON no formato:
{"anexo": "III", "permite_fator_r": true}

Regras:
- "anexo" deve ser "I", "II", "III", "IV" ou "V"
- Anexo I = Comércio
- Anexo II = Indústria  
- Anexo III = Serviços (receita de locação, academias, agências de viagem, escritórios contábeis, desenvolvimento de software, etc.)
- Anexo IV = Serviços (advocacia, limpeza, vigilância, construção civil)
- Anexo V = Serviços intelectuais (engenharia, arquitetura, medicina quando não qualificado para Fator R)
- "permite_fator_r" = true se a atividade pode migrar do Anexo V para III via Fator R (folha de pagamento >= 28% da receita)
- Muitas atividades de serviços profissionais podem ser III ou V dependendo do Fator R. Nesse caso, coloque "III" com permite_fator_r=true.

Responda SOMENTE o JSON, sem markdown, sem explicações.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI Gateway error:', errText);
      return new Response(
        JSON.stringify({ success: false, error: `AI error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content?.trim() || '';
    
    // Parse JSON from AI response
    let parsed: { anexo: string; permite_fator_r: boolean };
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(
        JSON.stringify({ success: false, error: 'Falha ao interpretar resposta da IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save to cnae_catalogo for future lookups
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    await fetch(`${supabaseUrl}/rest/v1/cnae_catalogo`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        codigo_cnae,
        descricao: descricao || '',
        anexo: parsed.anexo,
        permite_fator_r: parsed.permite_fator_r,
      }),
    });

    return new Response(
      JSON.stringify({ success: true, anexo: parsed.anexo, permite_fator_r: parsed.permite_fator_r }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
