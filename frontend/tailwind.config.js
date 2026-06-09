/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexusDark: "#09090b", // zinc-950
        nexusAccent: "#06b6d4", // Cyan-500
        nexusZinc: {
          900: "#18181b",
          800: "#27272a",
          700: "#3f3f46",
          400: "#a1a1aa",
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
