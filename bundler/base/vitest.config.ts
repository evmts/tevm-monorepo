import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			include: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
			exclude: ['src/types.ts', 'src/**/*.d.ts'],
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
				autoUpdate: true,
			},
		},
	},
})
