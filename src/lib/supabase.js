import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('[Supabase] Variables de entorno no configuradas. PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY son requeridas.');
}

export const supabase = createClient(url, key);
