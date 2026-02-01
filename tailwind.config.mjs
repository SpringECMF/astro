/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'dark': '#0A0E14',
                'primary': '#6025F5', // Corporate Purple
                'primary-dark': '#4c1dbf',
                'text-main': '#F3F4F6',
                'text-muted': '#9CA3AF',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
