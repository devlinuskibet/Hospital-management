import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Medical theme colors
        medical: {
          50: "hsl(190 100% 97%)",
          100: "hsl(192 100% 93%)",
          200: "hsl(194 100% 86%)",
          300: "hsl(195 100% 75%)",
          400: "hsl(196 100% 63%)",
          500: "hsl(198 100% 50%)",
          600: "hsl(200 100% 43%)",
          700: "hsl(201 100% 36%)",
          800: "hsl(203 100% 29%)",
          900: "hsl(205 100% 22%)",
          950: "hsl(207 100% 15%)",
        },
        success: {
          50: "hsl(138 76% 97%)",
          100: "hsl(141 84% 93%)",
          200: "hsl(141 79% 85%)",
          300: "hsl(142 77% 73%)",
          400: "hsl(142 69% 58%)",
          500: "hsl(142 71% 45%)",
          600: "hsl(142 76% 36%)",
          700: "hsl(142 72% 29%)",
          800: "hsl(143 64% 24%)",
          900: "hsl(144 61% 20%)",
          950: "hsl(146 80% 11%)",
        },
        warning: {
          50: "hsl(48 100% 96%)",
          100: "hsl(48 96% 89%)",
          200: "hsl(48 97% 77%)",
          300: "hsl(46 97% 65%)",
          400: "hsl(43 96% 56%)",
          500: "hsl(38 92% 50%)",
          600: "hsl(32 95% 44%)",
          700: "hsl(26 90% 37%)",
          800: "hsl(23 83% 31%)",
          900: "hsl(22 78% 26%)",
          950: "hsl(21 86% 14%)",
        },
        danger: {
          50: "hsl(0 86% 97%)",
          100: "hsl(0 93% 94%)",
          200: "hsl(0 96% 89%)",
          300: "hsl(0 94% 82%)",
          400: "hsl(0 91% 71%)",
          500: "hsl(0 84% 60%)",
          600: "hsl(0 72% 51%)",
          700: "hsl(0 74% 42%)",
          800: "hsl(0 70% 35%)",
          900: "hsl(0 63% 31%)",
          950: "hsl(0 75% 15%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
