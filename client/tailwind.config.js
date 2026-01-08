/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Intuit Primary Palette
        primary: {
          DEFAULT: '#236CFF',
          50: '#C2F5FF',   // agave-20
          100: '#81F2FE',  // agave-30
          200: '#69B1FF',
          300: '#4A94FF',
          400: '#3580FF',
          500: '#236CFF',  // super-blue
          600: '#1A5AD9',
          700: '#00254A',  // blueberry-110
          800: '#001D3D',
          900: '#001529'
        },
        // Intuit Secondary Colors
        blueberry: {
          DEFAULT: '#00254A',
          110: '#00254A'
        },
        agave: {
          20: '#C2F5FF',
          30: '#81F2FE'
        },
        wintermint: {
          100: '#EFF4F9'
        },
        tofu: {
          100: '#F4F4EF'
        },
        kiwi: {
          50: '#3BD85E'
        },
        olive: {
          10: '#E7FDC8'
        },
        spearmint: {
          110: '#003E31'
        },
        honey: {
          10: '#FFF2C1',
          40: '#F9C741',
          80: '#AA6700'
        },
        dragonfruit: {
          20: '#FFD1E9'
        },
        tomato: {
          DEFAULT: '#FF5C37'
        },
        watermelon: {
          110: '#4F0513'
        }
      },
      fontFamily: {
        sans: ['Avenir Next', 'Avenir', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      }
    },
  },
  plugins: [],
}
