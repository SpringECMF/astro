import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

const CF_URL = process.env.PUBLIC_SUPABASE_URL;
const CF_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;

export default defineConfig({
    integrations: [tailwind()],
    vite: {
        define: {
            ...(CF_URL ? { 'import.meta.env.PUBLIC_SUPABASE_URL':      JSON.stringify(CF_URL)  } : {}),
            ...(CF_KEY ? { 'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(CF_KEY) } : {}),
        },
    },
});
