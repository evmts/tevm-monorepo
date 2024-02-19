import { vitePluginTevm } from '@tevm/bundler/vite-plugin'
import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	plugins: [vitePluginTevm() as any],
	test: {
		include: ['src/**/*.{test,spec,bench}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
		},
	},
})
