import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			include: ['src/**/*.js'],
			exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/**/index.js', 'src/**/types.js', 'src/**/*Shape.js'],
			reporter: ['text', 'json-summary', 'json'],
			thresholds: {
				lines: 100,
				functions: 100,
				// 99% branch coverage to allow for defensive hexToBytes odd-length normalization
				// which is unreachable through normal execution (bytesToHex always produces even-length)
				branches: 99,
				statements: 100,
			},
		},
	},
})
