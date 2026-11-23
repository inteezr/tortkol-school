import type { Config } from 'tailwindcss';

const brand = {
  50: '#F1F7FF', 100: '#E0F0FF', 200: '#C1E8FF', 300: '#9DC0E6', 400: '#7DA0CA',
  500: '#5483B3', 600: '#1F4A86', 700: '#052659', 800: '#031A3F', 900: '#021024', 950: '#010A18',
};
const neutral = {
  50: '#F4F8FD', 100: '#E8F0FA', 200: '#D3E2F3', 300: '#B6CBE3', 400: '#7DA0CA',
  500: '#4A6A94', 600: '#34507A', 700: '#052659', 800: '#031A3F', 900: '#021024', 950: '#010A18',
};

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ===== Rang tizimi (color-2.jpg palitrasi) =====
        // #021024 ink · #052659 primary · #5483B3 steel · #7DA0CA sky · #C1E8FF ice
        ink: '#021024',
        deep: '#031A3F',
        bg: '#F3F8FE',
        surface: '#FFFFFF',
        'surface-tint': '#E0EEFB',
        primary: {
          DEFAULT: '#052659',
          hover: '#031A3F',
          soft: '#E0EEFB',
          glow: 'rgba(5, 38, 89, 0.15)',
        },
        // Brend ranglari shkalasi: eski sky/blue/indigo/... klasslari shu palitraga bog'langan
        sky: brand,
        blue: brand,
        indigo: brand,
        violet: brand,
        purple: brand,
        teal: brand,
        emerald: brand,
        cyan: brand,
        // Neytral shkala (matn, chegara, fon)
        slate: { ...neutral, DEFAULT: '#021024', muted: '#34507A', light: '#4A6A94' },
        gray: neutral,
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(2, 16, 36, 0.06), 0 2px 6px -1px rgba(2, 16, 36, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(5, 38, 89, 0.14), 0 4px 10px -2px rgba(2, 16, 36, 0.05)',
        glow: '0 0 60px 20px rgba(5, 38, 89, 0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
