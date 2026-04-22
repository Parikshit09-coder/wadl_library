/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          900: '#05345C', // on_surface
          800: '#133057', // on_primary_fixed
          700: '#1A365D', // user override
          600: '#3D618C', // on_surface_variant
          500: '#466089', // primary
          400: '#8E9EB7', // inverse_on_surface
          300: '#B3CDFD', // primary_container/inverse_primary
          200: '#DDE9FF', // surface_container_high
          100: '#F5F8FF', // surface_container_low
          50:  '#F8F9FF', // background/surface
        },
        surface: {
          lowest: '#FFFFFF',
          low: '#EFF4FF',
          high: '#DCE9FF',
          highest: '#D2E4FF',
        }
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['"Public Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'ambient': '0 4px 32px 6px rgba(5, 52, 92, 0.06)',
      }
    },
  },
  plugins: [],
}
