/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF8F0',
          100: '#FFE8D6',
          200: '#FFD1AC',
          300: '#FFBA82',
          400: '#FFA358',
          500: '#FF8C6B',
          600: '#FF6B6B',
        },
        secondary: {
          50: '#F0FFFC',
          100: '#DBFFF8',
          200: '#B7FFF1',
          300: '#93FFE9',
          400: '#6FFFE2',
          500: '#4ECDC4',
        },
        accent: {
          500: '#FFB347',
          600: '#FF9A30',
        }
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'confetti': 'confetti 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        confetti: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
