/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#ffffff",
        primary: "#FFFFFF",
        secondary: "#121212",
        accent: "#9EFF00",
        muted: "#B8B8B8",
        card: "#0A0A0A",
        border: "rgba(255,255,255,0.04)",
        "border-hover": "rgba(158,255,0,0.2)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%": { boxShadow: "0 0 5px rgba(158, 255, 0, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(158, 255, 0, 0.6), 0 0 40px rgba(158, 255, 0, 0.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
