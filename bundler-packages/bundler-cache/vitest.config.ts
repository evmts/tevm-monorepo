import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: true,
				lines: 95.32,
				functions: 70,
				branches: 100,
				statements: 95.32,
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
