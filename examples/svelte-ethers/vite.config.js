import { vitePluginEvmts } from '@evmts/vite-plugin'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit(), vitePluginEvmts()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
