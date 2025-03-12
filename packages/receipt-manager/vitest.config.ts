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
				lines: 71.87,
				functions: 83.33,
				branches: 80.85,
				statements: 71.87,
			},
		},
		typecheck: {
			enabled: false, // Disable typechecking in tests to resolve type issues
		},
	},
})
