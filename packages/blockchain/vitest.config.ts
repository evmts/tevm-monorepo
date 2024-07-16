import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
				test: {
								include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
								environment: 'node',
								coverage: {
												include: ['src/**/*.js'],
												provider: 'v8',
												reporter: ['text', 'json-summary', 'json'],
												thresholds: {
																autoUpdate: true,
																functions: 92,
																lines: 93.2,
																statements: 93.2,
																branches: 87.3,
												},
								},
				},
})