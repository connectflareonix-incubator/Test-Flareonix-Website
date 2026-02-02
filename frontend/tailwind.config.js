/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF4500",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF"
        },
        accent: {
          DEFAULT: "#FF6B00",
          foreground: "#000000"
        },
        muted: {
          DEFAULT: "#121212",
          foreground: "#A1A1AA"
        },
        border: "#27272A",
        input: "#27272A",
        ring: "#FF4500",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        }
      },
      fontFamily: {
        heading: ["Unbounded", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        accent: ["Syne", "sans-serif"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 69, 0, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 69, 0, 0.6)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        glow: "glow 2s ease-in-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
