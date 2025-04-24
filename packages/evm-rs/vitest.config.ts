import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.spec.ts'],
		exclude: ['**/*.disabled.ts', '**/*.test.ts.disabled', '**/node_modules/**'],
		testTimeout: 30000,
		mockReset: true,
		restoreMocks: true,
		clearMocks: true,
	},
})
