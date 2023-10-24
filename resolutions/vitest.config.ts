import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 99.47,
			functions: 100,
			branches: 96.49,
			statements: 99.47,
			thresholdAutoUpdate: true,
		},
	},
})
