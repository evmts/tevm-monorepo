import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['**/*.{test,spec,bench}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		globals: true,
		threads: false, // Disable threading for benchmarks
	},
})
