import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		include: ['**/*.spec.ts'],
		testTimeout: 20000,
	},
})
