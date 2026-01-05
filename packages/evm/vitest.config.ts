import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			include: ['src/**/*.js'],
			// Exclude guillotine WASM loader until WASM binary is built
			// TODO: Remove this exclusion once lib/guillotine-mini WASM build is fixed
			exclude: ['src/guillotineWasm.js'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				autoUpdate: true,
				// Adjusted thresholds during guillotine-mini migration
				// Lines 29-31, 226-227 in Evm.js are error handling for WASM failures
				// which are hard to trigger in tests without mocking
				lines: 98.67,
				functions: 100,
				branches: 88,
				statements: 98.67,
			},
		},
	},
})
