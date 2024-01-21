import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'

const dirs = [
	'.',
	'base-bundler',
	'bun-plugin',
	'compiler',
	'config',
	'esbuild-plugin',
	'rollup-plugin',
	'rspack-plugin',
	'ts-plugin',
	'solc',
	'vite-plugin',
	'webpack-plugin',
]

export default defineConfig(
	dirs.map((dir) =>
		createTsUpOptions({
			entry: [dir === '.' ? 'index.ts' : `${dir}/index.ts`],
			outDir: dir,
		}),
	),
)
