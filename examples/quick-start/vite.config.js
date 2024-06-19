import { vitePluginTevm } from 'tevm/bundler/vite-plugin'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		global: 'globalThis',
	},
	plugins: [
		nodePolyfills({
			include: ['stream'],
			globals: {
				process: true,
				Buffer: true,
				global: true,
			},
		}),
		vitePluginTevm(),
	],
})
