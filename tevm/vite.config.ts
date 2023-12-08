import { vitePluginEvmts } from '@evmts/vite-plugin'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

// https://vitest.dev/config/ - for docs
export default defineConfig({
	build: {
		outDir: 'dist',
		lib: {
			entry: [
				resolve(__dirname, 'src/index.ts'),
				resolve(__dirname, 'src/contract/contract.ts'),
				resolve(__dirname, 'src/vm/vm.ts'),
				resolve(__dirname, 'src/contract/common/common.ts'),
			],
			formats: ['es', 'cjs'],
		},
	},
	plugins: [vitePluginEvmts() as any],
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		environment: 'node',
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			lines: 100,
			statements: 100,
			functions: 100,
			branches: 100,
			thresholdAutoUpdate: true,
		},
	},
})
