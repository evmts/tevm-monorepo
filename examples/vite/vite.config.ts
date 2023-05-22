import { foundry } from '@evmts/vite-plugin'
import react from '@vitejs/plugin-react'
import { join } from 'path'
import { defineConfig } from 'vitest/config'

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
	build: {
		outDir: 'dist',
		minify: false,
	},
	resolve: {},
	test: {
		environment: 'jsdom',
	},
	plugins: [
		react(),
		foundry({
			out: 'artifacts',
			project: join(__dirname, '..'),
		}),
	],
})
