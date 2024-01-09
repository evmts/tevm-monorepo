import { vitePluginEvmts } from '@evmts/vite-plugin'
import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	plugins: [vitePluginEvmts() as any],
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 100,
			statements: 100,
			functions: 100,
			branches: 100,
			thresholdAutoUpdate: true,
		},
	},
})
