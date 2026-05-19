import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		include: ['src/**/*.spec.ts'],
		setupFiles: ['@tevm/test-matchers'],
		testTimeout: 120000,
		typecheck: {
			enabled: true,
			include: ['src/**/*.type-spec.ts'],
			ignoreSourceErrors: true,
		},
	},
})
