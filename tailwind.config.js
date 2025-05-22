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
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("tailwindcss-animate")
  ],
};