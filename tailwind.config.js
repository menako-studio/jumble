/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ——— Nunito & Outfit font ———
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      // ——— Duolingo-Inspired Bright & Playful Color Palette ———
      colors: {
        // Bright Duolingo Green
        duo: {
          green: {
            DEFAULT: '#58cc02',
            light:   '#79db28',
            dark:    '#46a302',
            shadow:  '#3c8d00',
          },
          blue: {
            DEFAULT: '#1cb0f6',
            light:   '#49c0f8',
            dark:    '#1899d6',
            shadow:  '#137eb3',
          },
          yellow: {
            DEFAULT: '#ffc800',
            light:   '#ffd433',
            dark:    '#e5b200',
            shadow:  '#cc9e00',
          },
          orange: {
            DEFAULT: '#ff9600',
            light:   '#ffab33',
            dark:    '#e58700',
            shadow:  '#cc7800',
          },
          purple: {
            DEFAULT: '#ce82ff',
            light:   '#d99bff',
            dark:    '#b862fa',
            shadow:  '#9d42e3',
          },
          red: {
            DEFAULT: '#ff4b4b',
            light:   '#ff6f6f',
            dark:    '#ea2b2b',
            shadow:  '#d11f1f',
          },
        },
        // Legacy Brand Palette
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
        accent: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        success: {
          400: '#79db28',
          500: '#58cc02',
          600: '#46a302',
        },
        danger: {
          400: '#ff6f6f',
          500: '#ff4b4b',
          600: '#ea2b2b',
        },
        surface: {
          bg:    '#131f24',   // playful dark teal/navy base
          card:  '#1d2d35',   // playful card panel
          panel: '#263843',   // elevated panel
          border:'#374e5d',   // stroke
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
        bounceMini: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        'float-up': {
          '0%':   { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-48px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(88, 204, 2, 0.4)' },
          '50%':       { boxShadow: '0 0 0 14px rgba(88, 204, 2, 0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shake:        'shake 0.5s ease-in-out',
        pop:          'pop 0.3s ease-out',
        bounceMini:   'bounceMini 1.5s ease-in-out infinite',
        'float-up':   'float-up 1s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow':  'spin-slow 12s linear infinite',
      },
      boxShadow: {
        'card':     '0 6px 24px rgba(0,0,0,0.3)',
        '3d-green': '0 5px 0 #46a302',
        '3d-blue':  '0 5px 0 #1899d6',
        '3d-yellow':'0 5px 0 #e5b200',
        '3d-purple':'0 5px 0 #b862fa',
        '3d-red':   '0 5px 0 #ea2b2b',
        'glow':     '0 0 24px rgba(88, 204, 2, 0.4)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.75rem',
        'xl4': '2.25rem',
      },
    },
  },
  plugins: [],
}
