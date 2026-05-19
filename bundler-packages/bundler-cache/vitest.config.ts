import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: false,
				lines: 100,
				functions: 100,
				branches: 94,
				statements: 100,
			},
			include: ['src/**/*.{js,ts}'],
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/types/**',
				'**/*.d.ts',
				'vitest.config.ts',
				'tsup.config.ts',
				'TestContract.d.ts',
				'source.ts',
			],
		},
	},
})
