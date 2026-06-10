/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ——— Nunito font (loaded via index.css @import) ———
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      // ——— Jumble Brand Palette ———
      colors: {
        // Primary — vibrant purple/indigo
        brand: {
          50:  '#f0f0ff',
          100: '#e2e0ff',
          200: '#c9c5fe',
          300: '#a99ffe',
          400: '#8673fb',
          500: '#6c4ff6',  // main
          600: '#5d34e8',
          700: '#4e25cf',
          800: '#3f1ea8',
          900: '#341c88',
        },
        // Accent — warm yellow/orange
        accent: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',  // main
          600: '#d97706',
        },
        // Success green
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        // Error red/coral
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Background system
        surface: {
          bg:    '#0f0a1e',   // very dark purple — main bg
          card:  '#1a1235',   // card bg
          panel: '#221845',   // panel bg
          border:'#3d2f7a',   // border
        },
      },
      // ——— Custom Animations ———
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%':       { transform: 'translateX(-10px)' },
          '30%':       { transform: 'translateX(10px)' },
          '45%':       { transform: 'translateX(-8px)' },
          '60%':       { transform: 'translateX(8px)' },
          '75%':       { transform: 'translateX(-4px)' },
          '90%':       { transform: 'translateX(4px)' },
        },
        pop: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'float-up': {
          '0%':   { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-48px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(108, 79, 246, 0.4)' },
          '50%':       { boxShadow: '0 0 0 12px rgba(108, 79, 246, 0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shake:       'shake 0.5s ease-in-out',
        pop:         'pop 0.3s ease-out',
        'float-up':  'float-up 1s ease-out forwards',
        'pulse-glow':'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      // ——— Box Shadows ———
      boxShadow: {
        'card':   '0 4px 24px rgba(0,0,0,0.35)',
        'word':   '0 4px 0 rgba(0,0,0,0.35)',
        'word-sm':'0 2px 0 rgba(0,0,0,0.3)',
        'glow':   '0 0 24px rgba(108,79,246,0.5)',
        'success':'0 0 20px rgba(34,197,94,0.4)',
        'danger': '0 0 20px rgba(239,68,68,0.4)',
      },
      // ——— Border Radius ———
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
        'xl4': '2rem',
      },
    },
  },
  plugins: [],
}
