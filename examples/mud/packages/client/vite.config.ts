import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mud } from "vite-plugin-mud";
import path from "path";

export default defineConfig({
  plugins: [react(), mud({ worldsFile: "../contracts/worlds.json" })],
  build: {
    target: "es2022",
    minify: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@tevm/mud/react": path.resolve(__dirname, "../../../../bundler-packages/mud/src/react/index.ts"),
      "@tevm/mud": path.resolve(__dirname, "../../../../bundler-packages/mud/src/index.ts"),
    },
  },
  optimizeDeps: {
    exclude: ["@tevm/mud", "@tevm/mud/react"],
  },
});
