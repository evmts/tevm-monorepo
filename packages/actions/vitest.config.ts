import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
				test: {
								include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
								environment: 'node',
								coverage: {
												reportOnFailure: true,
												include: ['src/**/*.js'],
												provider: 'v8',
												reporter: ['text', 'json-summary', 'json'],
												thresholds: {
																autoUpdate: true,
																lines: 88.22,
																functions: 98.63,
																branches: 78.99,
																statements: 88.22,
												},
								},
				},
})