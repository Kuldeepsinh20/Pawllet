/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF9',
          100: '#FAF7F2',
          200: '#F3ECE1',
          300: '#E9DEC9',
          400: '#DFCEB1',
        },
        pawNavy: {
          900: '#141E38',
          800: '#1A2748',
          700: '#22325A',
          600: '#2F4374',
          500: '#3D548F',
        },
        pawGold: {
          50: '#FDF9EF',
          100: '#FCF3DC',
          200: '#F7E4B2',
          300: '#EED084',
          400: '#E2BA55',
          500: '#D4A02A',
          600: '#BA861C',
          700: '#946614',
        },
        pawMint: {
          50: '#F2FAF6',
          100: '#E5F5ED',
          200: '#D2EDE0',
          300: '#B6E1CC',
          500: '#2E7D59',
          700: '#195339',
        },
        pawLavender: {
          50: '#F8F6FD',
          100: '#F0ECFA',
          200: '#E3DAF5',
          300: '#D2C3EE',
          500: '#754EB8',
          700: '#53318E',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Inter', 'sans-serif'],
        script: ['"Caveat"', '"Brush Script MT"', '"Comic Sans MS"', 'cursive'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(44, 30, 10, 0.05)',
        'folder': '0 6px 16px -2px rgba(186, 134, 28, 0.15)',
      }
    },
  },
  plugins: [],
}
