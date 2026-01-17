/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '105': '1.05',
        '107': '1.07',
        '110': '1.10',
      },
    },
  },
  plugins: [],
};