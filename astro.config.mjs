import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// Cloudflare Pages expone las vars en process.env pero Vite no las inyecta
// automáticamente en import.meta.env — este define fuerza la inyección.
const CF_URL = process.env.PUBLIC_SUPABASE_URL;
const CF_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;

export default defineConfig({
    integrations: [tailwind()],

    vite: {
        define: {
            ...(CF_URL  ? { 'import.meta.env.PUBLIC_SUPABASE_URL':      JSON.stringify(CF_URL)  } : {}),
            ...(CF_KEY  ? { 'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(CF_KEY)  } : {}),
        }
    },

    output: "hybrid",
    adapter: cloudflare()
});