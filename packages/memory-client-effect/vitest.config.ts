import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			include: ['src/**/*.js'],
			exclude: ['src/index.js', 'src/types.js', 'src/**/*.spec.ts'],
			thresholds: {
				lines: 60,
				branches: 80,
				functions: 50,
				statements: 60,
			},
		},
		testTimeout: 30_000,
	},
})
