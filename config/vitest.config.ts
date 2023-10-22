import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 99.87,
			statements: 99.87,
			functions: 100,
			branches: 99.12,
			thresholdAutoUpdate: true,
		},
	},
})
