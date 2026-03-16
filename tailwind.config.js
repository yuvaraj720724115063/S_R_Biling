/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00509f',
        secondary: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        background: '#f5f7f9',
        text: '#212529',
        border: '#92a4b7',
      },
    },
  },
  plugins: [],
}
