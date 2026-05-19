import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			include: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
			exclude: ['src/index.ts'], // Exclude TypeScript declaration file
			thresholds: {
				autoUpdate: false,
				lines: 97,
				functions: 80,
				branches: 100,
				statements: 94,
			},
		},
	},
})
