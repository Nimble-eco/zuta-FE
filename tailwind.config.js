module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '260px',
        'sm': '350px',
        'bmd': '540px'
      },
      padding: {
        safe: 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("tailwindcss-animate"),
    require('tailwind-scrollbar-hide'),
  ],
};