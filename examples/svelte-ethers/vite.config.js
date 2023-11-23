import { vitePluginEvmts } from '@evmts/vite-plugin'
import { sveltekit } from '@sveltejs/kit/vite'
import * as solc from 'solc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit(), vitePluginEvmts({ solc })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
