import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vitePluginEvmts } from '@evmts/vite-plugin'

export default defineConfig({
  plugins: [vitePluginEvmts(), remix(), tsconfigPaths()],
});
