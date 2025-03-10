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
																																lines: 83.44,
																																functions: 66.66,
																																branches: 97.36,
																																statements: 83.44,
																								},
																},
								},
})