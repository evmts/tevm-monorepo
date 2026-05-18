import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			include: ['src/**/*.js'],
			exclude: ['src/presets/__GENERATE_CHAIN_PRESETS__.js'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: true,
				lines: 100,
				functions: 76.92,
				branches: 88.23,
				statements: 100,
			},
		},
	},
})
