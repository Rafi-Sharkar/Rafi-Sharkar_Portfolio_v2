/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a14',
          800: '#14141f',
          700: '#1a1a2e',
          600: '#20202f',
          950: '#050508',
        },
        accent: {
          cyan: '#00d9ff',
          purple: '#b366ff',
          pink: '#ff66cc',
          emerald: '#00ff88',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
        'glow-lg': '0 0 20px rgba(6, 182, 212, 0.5), 0 0 42px rgba(139, 92, 246, 0.35), 0 8px 24px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
}
