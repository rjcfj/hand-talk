/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // azul padrão bonito
        secondary: "#fbbf24", // amarelo para destaque
      },
    },
  },
  plugins: [],
};
