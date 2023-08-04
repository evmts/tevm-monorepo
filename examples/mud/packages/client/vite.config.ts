import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vitePluginEvmts } from "@evmts/vite-plugin";

export default defineConfig({
  plugins: [react(), vitePluginEvmts()],
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  build: {
    target: "es2022",
    minify: true,
    sourcemap: true,
  },
});
