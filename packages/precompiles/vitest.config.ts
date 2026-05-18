import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			include: ['src/**/*.{js,ts}'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: true,
				lines: 49.33,
				functions: 90,
				branches: 76.31,
				statements: 49.33,
			},
		},
	},
})
