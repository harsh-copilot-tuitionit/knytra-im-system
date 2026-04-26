import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 20px 80px rgba(59, 130, 246, 0.18)',
      },
      colors: {
        brand: {
          950: '#020617',
          900: '#0f172a',
          500: '#2563eb',
          400: '#60a5fa',
          300: '#93c5fd',
        },
      },
    },
  },
  plugins: [],
};

export default config;
