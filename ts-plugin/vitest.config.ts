import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 93.15,
			branches: 85.21,
			functions: 100,
			statements: 93.15,
			thresholdAutoUpdate: true,
		},
	},
})
