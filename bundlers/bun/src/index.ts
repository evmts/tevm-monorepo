import { bundler } from '@evmts/bundler'
import { loadConfig } from '@evmts/config'
import type { BunPlugin } from 'bun'
import { exists, readFile } from 'fs/promises'

type EvmtsBunPluginOptions = {}

type EvmtsBunPlugin = (options?: EvmtsBunPluginOptions) => BunPlugin

export const evmtsBunPlugin: EvmtsBunPlugin = () => {
	const config = loadConfig(process.cwd())
	const moduleResolver = bundler(config, console)
	return {
		name: '@evmts/esbuild-plugin',
		setup(build) {
			/**
			 * @evmts/core is used to construct the evmts modules for solidity files
			 * sometimes the solidity file might exist in the node_modules folder
			 * or in a different package in a monorepo. We need to resolve it correctly
			 * in all cases so we always resolve to the current package's @evmts/core
			 */
			build.onResolve({ filter: /^@evmts\/core/ }, ({ path, importer }) => {
				if (
					path.startsWith('@evmts/core') &&
					!importer.startsWith(process.cwd()) &&
					!importer.includes('node_modules')
				) {
					return {
						path: require.resolve('@evmts/core'),
					}
				}
				return {
					path: require.resolve(path),
				}
			})

			/**
			 * Load solidity files with @evmts/bundler
			 * If a .d.ts file or .ts file is pregenerated already (as will be case for external contracts)
			 * go ahead and load that instead
			 */
			build.onLoad({ filter: /\.sol$/ }, async ({ path }) => {
				const filePaths = { dts: `${path}.d.ts`, ts: `${path}.ts` }
				const [dtsExists, tsExists] = await Promise.all(
					Object.values(filePaths).map((filePath) => exists(filePath)),
				)
				if (dtsExists) {
					const filePath = `${path}.d.ts`
					return {
						contents: await readFile(filePath, 'utf8'),
						watchFiles: [filePath],
					}
				}
				if (tsExists) {
					const filePath = `${path}.ts`
					return {
						contents: await readFile(filePath, 'utf8'),
						watchFiles: [filePath],
					}
				}

				const { code: contents, modules } =
					await moduleResolver.resolveEsmModule(path, process.cwd(), false)

				const watchFiles = Object.values(modules)
					.filter(({ id }) => !id.includes('node_modules'))
					.map(({ id }) => id)

				return { contents, watchFiles }
			})
		},
	}
}
