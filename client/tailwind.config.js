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
          DEFAULT: '#00f3ff', // Neon Cyan
          hover: '#00cbe6',
          glow: 'rgba(0, 243, 255, 0.5)'
        },
        secondary: {
          DEFAULT: '#7000ff', // Neon Purple
          hover: '#5e00d7'
        },
        dark: {
          900: '#0f172a', // Deep Navy
          800: '#1e293b',
          700: '#334155',
          glass: 'rgba(15, 23, 42, 0.7)'
        },
        surface: {
          light: '#f8fafc',
          dark: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(112, 0, 255, 0.5), 0 0 20px rgba(112, 0, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
