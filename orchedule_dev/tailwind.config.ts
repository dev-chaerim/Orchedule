module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './styles/**/*.{css,scss}',
    ],
    theme: {
       extend: {
       padding: {
          safe: 'env(safe-area-inset-bottom)', // ✅ 하단 safe area 대응
        },
      },
    },
    plugins: [],
  };
  