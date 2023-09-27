import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 99.44,
			functions: 97.14,
			branches: 94.44,
			statements: 99.44,
			thresholdAutoUpdate: true,
		},
	},
})
