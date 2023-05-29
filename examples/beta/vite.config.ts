import { vitePluginEvmts } from '@evmts/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		global: 'globalThis',
	},
	build: {
		rollupOptions: {
			external: [
				'@safe-globalThis/safe-apps-provider',
				'@safe-globalThis/safe-apps-sdk',
			],
		},
	},
	resolve: {
		alias: {
			process: 'process/browser',
			util: 'util',
		},
	},
	plugins: [react(), vitePluginEvmts() as any],
})
