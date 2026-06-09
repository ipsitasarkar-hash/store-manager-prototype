import type { Config } from "tailwindcss";
import { elColors, elSpacing, elBorderRadius, elBoxShadow, elFontSize } from "./src/design-system/tokens/el-tailwind";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ["'72'", "'72full'", 'SAP-icons', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* SAP Horizon font scale from Figma */
        'sap-xs': ['0.75rem', { lineHeight: '1rem' }],
        'sap-sm': ['0.875rem', { lineHeight: '1.3125rem' }],
        'sap-base': ['1rem', { lineHeight: '1.5rem' }],
        'sap-lg': ['1.5rem', { lineHeight: '2rem' }],
        /* EL Design System */
        ...elFontSize,
      },
      spacing: {
        /* SAP Horizon spacing from Figma */
        'sap-zero': '0px',
        'sap-tiny': '0.5rem',
        'sap-small': '1rem',
        'sap-medium': '1.25rem',
        'sap-large': '1.5rem',
        'sap-xl': '2rem',
        'sap-xxl': '3rem',
        /* EL Design System */
        ...elSpacing,
      },
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
        teal: {
          DEFAULT: "hsl(var(--teal))",
          foreground: "hsl(var(--teal-foreground))",
          light: "hsl(var(--teal-light))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        "chat-primary": {
          DEFAULT: "hsl(var(--chat-primary))",
          foreground: "hsl(var(--chat-primary-foreground))",
        },
        "chat-muted": "hsl(var(--chat-muted))",
        "chat-border": "hsl(var(--chat-border))",
        "label-accent": {
          DEFAULT: "hsl(var(--label-accent))",
          foreground: "hsl(var(--label-accent-foreground))",
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
        /* EL Design System */
        ...elColors,
      },
      borderRadius: {
        /* SAP Horizon radii from Figma */
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xs: "0.25rem",
        /* EL Design System */
        ...elBorderRadius,
      },
      boxShadow: {
        /* SAP Horizon shadows */
        'sap-0': '0 0 2px 0 rgba(34,53,72,0.20), 0 2px 4px 0 rgba(34,53,72,0.20)',
        'sap-1': '0 0 0 1px rgba(34,53,72,0.48), 0 2px 8px 0 rgba(34,53,72,0.30)',
        /* EL Design System */
        ...elBoxShadow,
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "gradient-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "blob-1": {
          "0%":   { transform: "translate(0px, 0px) scale(1) rotate(0deg)",    opacity: "0.7" },
          "25%":  { transform: "translate(50px, -40px) scale(1.2) rotate(45deg)",  opacity: "0.9" },
          "50%":  { transform: "translate(20px, -70px) scale(0.85) rotate(90deg)", opacity: "0.6" },
          "75%":  { transform: "translate(-30px, -20px) scale(1.1) rotate(135deg)", opacity: "0.85" },
          "100%": { transform: "translate(0px, 0px) scale(1) rotate(180deg)",   opacity: "0.7" },
        },
        "blob-2": {
          "0%":   { transform: "translate(0px, 0px) scale(1) rotate(0deg)",     opacity: "0.6" },
          "20%":  { transform: "translate(-40px, 30px) scale(1.15) rotate(-30deg)", opacity: "0.8" },
          "50%":  { transform: "translate(-60px, -20px) scale(0.9) rotate(-90deg)", opacity: "0.5" },
          "80%":  { transform: "translate(30px, 40px) scale(1.2) rotate(-150deg)", opacity: "0.75" },
          "100%": { transform: "translate(0px, 0px) scale(1) rotate(-180deg)",  opacity: "0.6" },
        },
        "blob-3": {
          "0%":   { transform: "translate(0px, 0px) scale(1)",     opacity: "0.5" },
          "30%":  { transform: "translate(60px, 30px) scale(1.3)", opacity: "0.8" },
          "60%":  { transform: "translate(-20px, 50px) scale(0.8)", opacity: "0.4" },
          "100%": { transform: "translate(0px, 0px) scale(1)",     opacity: "0.5" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "blob-4": {
          "0%":   { transform: "translate(0px, 0px) scale(1)",      opacity: "0.4" },
          "40%":  { transform: "translate(-50px, -40px) scale(1.25)", opacity: "0.7" },
          "70%":  { transform: "translate(40px, -60px) scale(0.75)", opacity: "0.3" },
          "100%": { transform: "translate(0px, 0px) scale(1)",      opacity: "0.4" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-left": "slide-in-left 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "spin-slow": "spin-slow 3s linear infinite",
        "blob-1": "blob-1 9s ease-in-out infinite",
        "blob-2": "blob-2 12s ease-in-out infinite",
        "blob-3": "blob-3 7s ease-in-out infinite 1s",
        "blob-4": "blob-4 11s ease-in-out infinite 3s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
