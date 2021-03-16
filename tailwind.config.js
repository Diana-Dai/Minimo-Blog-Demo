module.exports = {
  // Optimize the size of tailwind css file
  purge: {
    enabled: true,
    content: ["./src/*.html"],
  },
  darkMode: false,
  theme: { extend: {} },
  variants: { extend: {} },
  plugins: [],
};
