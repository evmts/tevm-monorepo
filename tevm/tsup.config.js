import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'

const dirs = [
	'.',
	'api',
	'bundler',
	'bundler/bun-plugin',
	'bundler/compiler',
	'bundler/config',
	'bundler/esbuild-plugin',
	'bundler/rollup-plugin',
	'bundler/rspack-plugin',
	'bundler/ts-plugin',
	'bundler/solc',
	'bundler/vite-plugin',
	'bundler/webpack-plugin',
	'client',
	'contract',
	'viem',
	'vm',
]

export default defineConfig(
	dirs.map((dir) =>
		createTsUpOptions({
			entry: [dir === '.' ? 'index.ts' : `${dir}/index.ts`],
			outDir: dir,
		}),
	),
)
