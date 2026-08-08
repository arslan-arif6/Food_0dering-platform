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
        cream: {
          DEFAULT: "#F5E6D3",
          dark: "#EAD3B4",
        },
        offwhite: "#FAF9F6",
        sage: {
          DEFAULT: "#7A9E7E",
          dark: "#5C7F60",
          light: "#A8C3AB",
        },
        walnut: {
          DEFAULT: "#4A3F35",
          light: "#6B5D4F",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-figtree)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(74, 63, 53, 0.18)",
        "soft-lg": "0 24px 70px -20px rgba(74, 63, 53, 0.28)",
        tape: "0 2px 6px rgba(74, 63, 53, 0.25)",
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
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};