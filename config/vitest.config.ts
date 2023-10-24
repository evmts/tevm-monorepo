import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 98.55,
			statements: 98.55,
			functions: 100,
			branches: 98.83,
			thresholdAutoUpdate: true,
		},
	},
})
