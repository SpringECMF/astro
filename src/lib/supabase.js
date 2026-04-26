import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('[Supabase] PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY no definidas.');
}

// createClient lanza si recibe undefined — guard para que el resto de scripts no mueran
export const supabase = (url && key)
    ? createClient(url, key)
    : { from: () => ({ insert: async () => ({ error: { code: 'ENV_MISSING', message: 'Supabase no configurado' } }) }) };
