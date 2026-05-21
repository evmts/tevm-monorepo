import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		setupFiles: ['../../test/vitest-matchers/utils.ts'],
		testTimeout: 60000,
		coverage: {
			include: ['src/**/*.js'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: false,
				lines: 94,
				functions: 86,
				branches: 83,
				statements: 94,
			},
		},
	},
})
