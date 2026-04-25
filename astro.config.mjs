import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

export default defineConfig({
    site: 'https://springecmf.github.io',
    base: '/astro/',
    integrations: [tailwind()]
});
