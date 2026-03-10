/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
      },
      colors: {
        background:  "hsl(var(--background) / <alpha-value>)",
        foreground:  "hsl(var(--foreground) / <alpha-value>)",
        card:        "hsl(var(--card) / <alpha-value>)",
        border:      "hsl(var(--border) / <alpha-value>)",
        input:       "hsl(var(--input) / <alpha-value>)",
        primary: {
          DEFAULT:    "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        "chat-bot":               "hsl(var(--chat-bot) / <alpha-value>)",
        "chat-user":              "hsl(var(--chat-user) / <alpha-value>)",
        "chat-option":            "hsl(var(--chat-option) / <alpha-value>)",
        "chat-option-foreground": "hsl(var(--chat-option-foreground) / <alpha-value>)",
        "trust-badge":            "hsl(var(--trust-badge) / <alpha-value>)",
        "trust-badge-foreground": "hsl(var(--trust-badge-foreground) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}