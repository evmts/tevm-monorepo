import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		setupFiles: ['./src/index.ts'],
		include: ['**/*.spec.ts'],
		testTimeout: 20000,
		typecheck: {
			enabled: true,
			include: ['**/*.type-spec.ts'],
			ignoreSourceErrors: true,
		},
	},
})
