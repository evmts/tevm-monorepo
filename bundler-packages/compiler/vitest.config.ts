import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: true,
				lines: 97.42,
				functions: 100,
				branches: 85.71,
				statements: 97.42,
			},
		},
	},
})
