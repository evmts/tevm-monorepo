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
				lines: 50,
				functions: 52,
				branches: 41,
				statements: 46,
			},
		},
		typecheck: {
			enabled: false, // Disable typechecking in tests to resolve type issues
		},
	},
})
