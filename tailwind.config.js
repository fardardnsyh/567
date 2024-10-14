/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "ui-system"],
    },
    extend: {
      colors: {
        primary: "#FFDCC9",
        text: "#F0B595",
        "dark-text": "#D79876",
      },
    },
  },
  plugins: [],
};
