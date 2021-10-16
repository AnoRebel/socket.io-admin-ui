import { defineConfig } from "windicss/helpers";

export default defineConfig({
  mode: "jit",
  extract: {
    include: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    exclude: ["node_modules/**/*", ".git/**/*"],
  },
  darkMode: "class", // or 'media' or 'false'
  theme: {
    extend: {},
  },
  plugins: [
    require("windicss/plugin/aspect-ratio"),
    require("windicss/plugin/forms"),
    require("windicss/plugin/line-clamp"),
  ],
});
