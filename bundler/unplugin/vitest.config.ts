import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 95.96,
			functions: 100,
			branches: 87.5,
			statements: 95.96,
			thresholdAutoUpdate: true,
		},
	},
})
