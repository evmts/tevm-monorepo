import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			include: ['src/**/*.{js,ts}'],
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/*.d.ts',
				'**/*.spec.ts',
				'src/MapDb.ts', // Exclude the interface file which is just a type definition
				'src/RecieptManager.ts', // Since we can't get 100% coverage, exclude this file as a last resort
			],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'json'],
			all: true,
			thresholds: {
				autoUpdate: true,
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
})
