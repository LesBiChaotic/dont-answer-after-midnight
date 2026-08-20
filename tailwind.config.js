/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        afterhours: ['Inter', 'Manrope', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        'device-font': ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        mono: ['"IBM Plex Mono"', '"SF Mono"', 'Consolas', '"Liberation Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        // Core Master Palette
        ah: {
          canvas: 'var(--ah-canvas)',
          surface: 'var(--ah-surface)',
          'surface-2': 'var(--ah-surface-2)',
          'surface-3': 'var(--ah-surface-3)',
          text: 'var(--ah-text)',
          'text-2': 'var(--ah-text-2)',
          muted: 'var(--ah-muted)',
          border: 'var(--ah-border)',
          hover: 'var(--ah-hover)',

          // Accent Families
          primary: 'var(--ah-primary)',
          'primary-hover': 'var(--ah-primary-hover)',
          periwinkle: 'var(--ah-periwinkle)',
          'electric-lilac': 'var(--ah-electric-lilac)',
          teal: 'var(--ah-teal)',
          rose: 'var(--ah-rose)',
          apricot: 'var(--ah-apricot)',
          gold: 'var(--ah-gold)',

          // Semantic
          success: 'var(--ah-success)',
          warning: 'var(--ah-warning)',
          danger: 'var(--ah-danger)',
          info: 'var(--ah-info)',
        },

        // Legacy Aliases for backwards compatibility with enhanced palettes
        brand: {
          50: '#F0E8F4',
          100: '#E8EEF8',
          200: '#C9B9D2',
          300: '#8197FF',
          400: '#B58AF4',
          500: '#B979FF',
          600: '#6E45C7',
          700: '#5B35B2',
          800: '#342456',
          900: '#211C30',
          950: '#191625',
        },
        night: {
          bg: '#11101A',
          surface: '#191625',
          card: '#211C30',
          border: '#2E2742',
          hover: '#2B243E',
          muted: '#91819A',
          text: '#F4EEF8',
        },
        day: {
          bg: '#F7F2F7',
          surface: '#FFF9FC',
          card: '#F0E8F4',
          border: '#E4DAE8',
          hover: '#EADFEF',
          muted: '#927F97',
          text: '#201726',
        },
      },
      screens: {
        'xs': '360px',
        'sm': '390px',
        'md': '430px',
        'desktop': '768px',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      boxShadow: {
        'glow-periwinkle': '0 0 16px -2px rgba(129, 151, 255, 0.35)',
        'glow-lilac': '0 0 16px -2px rgba(185, 121, 255, 0.35)',
        'glow-apricot': '0 0 16px -2px rgba(240, 160, 109, 0.35)',
        'glow-teal': '0 0 16px -2px rgba(87, 199, 193, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
        'halo-pulse': 'haloPulse 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        haloPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}
