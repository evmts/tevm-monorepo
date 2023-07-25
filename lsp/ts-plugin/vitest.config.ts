import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 96.65,
			branches: 100,
			functions: 94.44,
			statements: 96.65,
			thresholdAutoUpdate: true,
		},
	},
})
