import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['docs/pages/**/*.test.ts'],
		testTimeout: 20000, // Some tests might need more time when forking
	},
})
