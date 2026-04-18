/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        jotform: {
          blue: "#0099FF",
          orange: "#FF6100",
          yellow: "#FFB629",
          navy: "#0A1551",
        },
      },
    },
  },
  plugins: [],
}
