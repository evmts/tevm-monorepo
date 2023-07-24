import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 99.78,
			statements: 99.78,
			functions: 100,
			branches: 88.05,
			thresholdAutoUpdate: true,
		},
	},
})
