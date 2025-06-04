import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
				test: {
								include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
								environment: 'node',
								testTimeout: 20_000,
								coverage: {
												reporter: ['text', 'json-summary', 'json'],
												thresholds: {
																autoUpdate: true,
																lines: 59.82,
																functions: 70.49,
																branches: 89.78,
																statements: 59.82,
												},
								},
				},
})