import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		setupFiles: ['../../extensions/test-matchers/src/index.ts'],
		coverage: {
			reportOnFailure: true,
			include: ['src/**/*.js'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: false,
				lines: 0,
				functions: 0,
				branches: 0,
				statements: 0,
			},
		},
	},
})
