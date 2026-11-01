import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#142B4A', 700: '#1B3A63', 800: '#142B4A', 900: '#0E1F36' },
        brand: { DEFAULT: '#2563EB', dark: '#1D4ED8', soft: '#EAF1FE' },
        agua: { DEFAULT: '#14B8A6', soft: '#E6F8F5', dark: '#0F766E' },
        sol: { DEFAULT: '#F5B942', soft: '#FEF4DD', dark: '#8A5A00' },
        fundo: '#F3F5F8',
        ink: '#1E293B',
        suave: '#64748B',
      },
      fontFamily: { sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 1px 2px rgba(20,43,74,.06), 0 4px 14px rgba(20,43,74,.05)' },
    },
  },
  plugins: [],
};
export default config;
