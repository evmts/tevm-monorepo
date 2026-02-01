import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'json-summary'],
			include: ['src/**/*.js'],
			exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/index.js', 'src/types.js'],
		},
	},
})
