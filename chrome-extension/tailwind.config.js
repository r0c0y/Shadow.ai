/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./popup.html", "./options.html"],
  theme: {
    extend: {
      colors: {
        "agent-black": "#050505",
        "agent-green": {
          400: "#34d399",
          500: "#10b981",
          600: "#059669"
        },
        "zinc": {
          900: "#18181b",
          800: "#27272a"
        }
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 2s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      boxShadow: {
        agent: "0 4px 20px rgba(16, 185, 129, 0.15)",
        "agent-lg": "0 10px 40px rgba(16, 185, 129, 0.2)",
      },
    },
  },
  plugins: [],
  // Safelist important classes that might be dynamically generated
  safelist: [
    "bg-green-50",
    "bg-red-50",
    "bg-blue-50",
    "bg-yellow-50",
    "bg-purple-50",
    "text-green-600",
    "text-red-600",
    "text-blue-600",
    "text-yellow-600",
    "text-purple-600",
    "border-green-200",
    "border-red-200",
    "border-blue-200",
    "border-yellow-200",
    "border-purple-200",
  ],
};
