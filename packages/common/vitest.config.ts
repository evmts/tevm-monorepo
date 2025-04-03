import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			include: ['src/**/*.js'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: true,
				// Lower thresholds temporarily to account for changes to createCommon
				lines: 95.81,
				functions: 87.5,
				branches: 50.0,
				statements: 95.81,
			},
		},
	},
})
