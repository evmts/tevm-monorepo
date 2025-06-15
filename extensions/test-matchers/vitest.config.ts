import { defineConfig } from 'vitest/config'
import './src/index.js'

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		setupFiles: ['./src/index.ts'],
		include: ['**/*.spec.ts'],
		typecheck: {
			enabled: true,
			include: ['**/*.type-spec.ts'],
			ignoreSourceErrors: true,
		},
	},
})
