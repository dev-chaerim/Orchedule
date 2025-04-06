/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // ✅ 더 넓게 열어줍니다
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './**/*.{html,css}',          // ✅ 혹시 몰라서 전체 css/html 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
