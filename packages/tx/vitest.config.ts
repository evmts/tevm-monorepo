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
				// Lower thresholds temporarily to accommodate changes for ethereumjs alpha
				lines: 93.42,
				functions: 100,
				branches: 95.83,
				statements: 93.42,
			},
		},
	},
})
