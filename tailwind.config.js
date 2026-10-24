/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme: white + black (Antigravity style).
        // Token names are kept so every existing component re-themes automatically.
        cream: {
          DEFAULT: "#F5F5F6",
          dark: "#E8E8EA",
        },
        offwhite: "#FFFFFF",
        sage: {
          DEFAULT: "#18181B",
          dark: "#2C2C30",
          light: "#A1A1AA",
        },
        walnut: {
          DEFAULT: "#0F0F10",
          light: "#6B6B72",
        },
      },
      fontFamily: {
        display: ["var(--font-figtree)", "sans-serif"],
        fraunces: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-figtree)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(15, 15, 16, 0.12)",
        "soft-lg": "0 24px 70px -20px rgba(15, 15, 16, 0.22)",
        tape: "0 2px 6px rgba(15, 15, 16, 0.2)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        steam: {
          "0%, 100%": {
            transform: "translateY(0) scaleY(1)",
            opacity: "0.5",
          },
          "50%": {
            transform: "translateY(-10px) scaleY(1.15)",
            opacity: "0.9",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-14px)",
          },
        },
        cursor: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(24px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        steam: "steam 3.2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        cursor: "cursor 1s steps(1) infinite",
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};