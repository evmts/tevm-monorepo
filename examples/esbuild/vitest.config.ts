import { vitePluginEvmts } from '@evmts/vite-plugin'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vitePluginEvmts()],
	test: {
		setupFiles: ['./setupVitest.ts'],
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 80,
			branches: 50,
			functions: 80,
			statements: 80,
		},
	}
})
