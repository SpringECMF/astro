import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
};

function anonymizeIp(ip: string): string {
  if (!ip || ip === 'unknown') return 'unknown';
  if (ip.includes('.')) {
    return ip.split('.').slice(0, 3).join('.') + '.xxx';
  }
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts.slice(0, -1).join(':') + ':xxxx';
  }
  return 'unknown';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS });
  }

  const rawIp =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Enlazar con el consentimiento previo de la misma sesión
  const { data: prev } = await supabase
    .from('cookie_consents')
    .select('id')
    .eq('session_id', body.session_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from('cookie_consents').insert({
    session_id:          body.session_id,
    technical:           true,
    analytics:           body.analytics ?? false,
    marketing:           body.marketing ?? false,
    consent_version:     body.consent_version,
    action:              body.action,
    user_agent:          body.user_agent,
    page_url:            body.page_url,
    ip_anonymized:       anonymizeIp(rawIp),
    expires_at:          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    previous_consent_id: prev?.id ?? null,
  });

  if (error) {
    console.error('[save-consent]', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
});
