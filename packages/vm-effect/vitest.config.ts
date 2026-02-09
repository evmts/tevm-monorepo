import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			include: ['src/**/*.js'],
			exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/**/index.js', 'src/**/types.js', 'src/**/*Shape.js'],
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				lines: 0,
				functions: 0,
				branches: 0,
				statements: 0,
			},
		},
	},
})
