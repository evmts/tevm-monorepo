import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true
      },
      // Force client-side only rendering
      kit: {
        ssr: false,
        browser: {
          hydrate: true,
          router: true
        }
      }
    })
  ],
  
  resolve: {
    alias: {
      '$lib': '/Users/williamcory/tevm/main/app/src/lib',
      '$components': '/Users/williamcory/tevm/main/app/src/components'
    }
  },
  
  optimizeDeps: {
    include: ['monaco-editor']
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
