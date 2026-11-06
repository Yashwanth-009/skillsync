/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Vibrant Emerald Green
          light: '#34D399',
          dark: '#059669',
          deep: '#047857',
        },
        secondary: {
          DEFAULT: '#14B8A6', // Soft Teal Green
          light: '#2DD4BF',
          dark: '#0D9488',
        },
        accent: {
          DEFAULT: '#84CC16', // Bright Lime Accent
          light: '#A3E635',
          dark: '#65A30D',
        },
        amber: {
          accent: '#F59E0B',
        },
        background: '#F0FDF4', // Soft Mint Off-White Background
        surface: '#FFFFFF',    // Pure White Card Surface
        darkbg: '#022C22',     // Deep Obsidian Emerald Dark Mode
        darkcard: '#064E3B',   // Dark Emerald Card Surface
        slate: {
          900: '#064E3B', // Dark Emerald Slate Text
          800: '#065F46',
          700: '#047857',
          500: '#059669', // Medium Emerald Text
          400: '#10B981',
          300: '#6EE7B7',
          100: '#D1FAE5',
          50: '#ECFDF5',
        },
        error: '#F43F5E',
        success: '#10B981',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '20px',
        'xl': '16px',
        'lg': '14px',
      },
      boxShadow: {
        'card': '0 6px 30px -4px rgba(16, 185, 129, 0.15), 0 4px 12px -2px rgba(16, 185, 129, 0.08)',
        'card-hover': '0 12px 35px -4px rgba(16, 185, 129, 0.25), 0 6px 16px -2px rgba(16, 185, 129, 0.12)',
        'nav': '0 -4px 24px -2px rgba(16, 185, 129, 0.10)',
        'glow': '0 0 24px rgba(16, 185, 129, 0.35)',
        'glow-lg': '0 0 35px rgba(16, 185, 129, 0.50)',
      },
      animation: {
        'bounce-slow': 'bounce 2.5s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

