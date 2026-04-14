import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sentinel: {
          blue: "#0070f3",
          gray: "#fafafa",
          border: "#eaeaea",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
