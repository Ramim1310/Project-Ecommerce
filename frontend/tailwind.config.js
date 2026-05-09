/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexusDark: "#0a0a0a", // Custom branding color
        nexusAccent: "#06b6d4", // Cyan-500
      },
    },
  },
  plugins: [],
}
