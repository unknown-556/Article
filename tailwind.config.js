/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'white-custom': '0 4px 6px rgba(255, 255, 255, 0.4), 0 1px 3px rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
};

