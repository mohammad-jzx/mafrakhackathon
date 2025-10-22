/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#f7f5f3',
          100: '#ede6de',
          200: '#d9c7b4',
          300: '#c4a584',
          400: '#b18a5e',
          500: '#a1794c',
          600: '#8a6640',
          700: '#715337',
          800: '#5d4530',
          900: '#4d3a29',
        },
        sage: {
          50: '#f6f7f2',
          100: '#e9eee0',
          200: '#d3dcc3',
          300: '#b4c39b',
          400: '#91a371',
          500: '#758651',
          600: '#5a6a3e',
          700: '#465332',
          800: '#3a442b',
          900: '#323b26',
        },
        forest: {
          50: '#f0f9f0',
          100: '#dbf1db',
          200: '#b9e3ba',
          300: '#8ccf8e',
          400: '#5bb35f',
          500: '#36973a',
          600: '#277a2a',
          700: '#226124',
          800: '#1f4e20',
          900: '#1a401c',
        }
      },
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'fadeIn': 'fadeIn 0.6s ease-in',
        'scale': 'scale 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
};