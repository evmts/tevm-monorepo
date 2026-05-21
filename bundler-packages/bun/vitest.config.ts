import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: false,
				lines: 23,
				functions: 27,
				branches: 9,
				statements: 23,
			},
		},
	},
})
