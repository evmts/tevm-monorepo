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
				autoUpdate: false,
				lines: 38,
				functions: 56,
				branches: 57,
				statements: 40,
			},
		},
	},
})
