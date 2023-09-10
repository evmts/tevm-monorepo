import { vitePluginEvmts } from '@evmts/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: 'dist',
	},
	resolve: {
		alias: {
			process: 'process/browser',
			util: 'util',
		},
	},
	plugins: [react(), vitePluginEvmts() as any],
})
