import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		setupFiles: ['./src/test/vitest.setup.ts'],
		environment: 'node',
		globals: true,
		include: ['**/*.spec.ts'],
		testTimeout: 60_000,
	},
})
