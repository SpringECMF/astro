import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Log visible en consola del browser para confirmar que las vars están en el bundle
console.log('[Supabase] URL configurada:', url ? url.slice(0, 30) + '...' : 'NO DEFINIDA ⚠️');
if (!url || !key) {
    console.error('[Supabase] PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY no definidas.');
}

// createClient lanza si recibe undefined — guard para que el resto de scripts no mueran
export const supabase = (url && key)
    ? createClient(url, key)
    : { from: () => ({ insert: async () => ({ error: { code: 'ENV_MISSING', message: 'Variables PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY ausentes en el build' } }) }) };
