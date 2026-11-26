import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { bg: "#0A0612", violet: "#A100F2", pink: "#FF00B8" } } },
  plugins: [],
} satisfies Config;
