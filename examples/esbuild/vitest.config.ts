import { vitePluginEvmts } from '@evmts/vite-plugin'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vitePluginEvmts()],
	test: {
		setupFiles: ['./setupVitest.ts'],
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 100,
			branches: 50,
			functions: 100,
			statements: 100,
			thresholdAutoUpdate: true,
		},
	},
})
