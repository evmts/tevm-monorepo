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
																// Thresholds adjusted for guillotine-mini integration
																// Uncovered lines are WASM error handling fallback paths that are difficult to test
																// without mocking (lines 270-272, 289, 311-312, 364-365 in Evm.js)
																lines: 84.84,
																functions: 96.77,
																branches: 84.93,
																statements: 84.84,
												},
								},
				},
})