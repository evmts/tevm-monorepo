import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		exclude: ['**/.worktrees/**', ...configDefaults.exclude],
	},
})
