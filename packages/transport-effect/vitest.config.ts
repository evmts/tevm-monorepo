import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			include: ['src/**/*.js'],
			exclude: [
				'src/types.js',
				'src/TransportShape.js',
				'src/ForkConfigShape.js',
				'src/index.js',
				'src/**/*.spec.ts',
				'src/**/*.test.ts',
			],
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
