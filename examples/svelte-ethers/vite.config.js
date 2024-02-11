import { sveltekit } from '@sveltejs/kit/vite'
import { vitePluginTevm } from '@tevm/vite-plugin'
import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit(), vitePluginTevm({}), topLevelAwait()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
