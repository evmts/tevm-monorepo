import { sveltekit } from '@sveltejs/kit/vite'
import { vitePluginTevm } from '@tevm/vite-plugin'
import { defineConfig } from 'vitest/config'
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
	plugins: [sveltekit(), vitePluginTevm({}), topLevelAwait()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
