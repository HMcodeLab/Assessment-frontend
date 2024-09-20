/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}","./src/Components/*.{html,js,jsx}"],
  theme: {
    screens:{
      xsm:{min:'320px',max:'480px'}
    },
  },
  plugins: [],
}