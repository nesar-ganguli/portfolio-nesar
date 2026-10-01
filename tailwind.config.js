export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201d",
        paper: "#f7f8f5",
        moss: "#136f63",
        coral: "#d25b44",
        amber: "#c99020",
        steel: "#3569a8",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(23, 32, 29, 0.12)",
        glow: "0 24px 70px rgba(45, 212, 191, 0.18)",
      },
    },
  },
  plugins: [],
};
