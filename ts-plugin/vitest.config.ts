import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 94.52,
			branches: 87.38,
			functions: 100,
			statements: 94.52,
			thresholdAutoUpdate: true,
		},
	},
})
