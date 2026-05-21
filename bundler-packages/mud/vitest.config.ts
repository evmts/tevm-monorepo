import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		testTimeout: 20_000,
		hookTimeout: 20_000,
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: false,
				// TODO: Thresholds lowered temporarily due to skipped React tests
				// (waiting for @latticexyz/store-sync fix for sendCallsSync export)
				lines: 49,
				functions: 54,
				branches: 32,
				statements: 49,
			},
		},
	},
})
