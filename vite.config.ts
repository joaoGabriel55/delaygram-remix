import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    !process.env.VITEST && reactRouter(),
    react(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    setupFiles: ["./vitest-setup.js"],
    environment: "jsdom",
  },
});
