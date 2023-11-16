import { bunFileAccesObject } from './bunFileAccessObject.js'
import { bundler, createCache } from '@evmts/base'
import { loadConfig } from '@evmts/config'
import { runSync } from 'effect/Effect'

/**
 * @evmts/bun-plugin is a bun plugin that allows you to import solidity files into your typescript files
 * and have them compiled to typescript on the fly.
 * @returns {import("bun").BunPlugin}
 * @example
 * ```ts plugin.ts
 * import { evmtsBunPlugin } from '@evmts/esbuild-plugin'
 * import { plugin } from 'bun'
 *
 * plugin(evmtsBunPlugin())
 * ```
 *
 * ```ts bunfig.toml
 * preload = ["./plugins.ts"]
 * ```
 */
export const evmtsBunPlugin = () => {
	return {
		name: '@evmts/esbuild-plugin',
		async setup(build) {
			const config = runSync(loadConfig(process.cwd()))
			const solcCache = createCache(console)
			const moduleResolver = bundler(
				config,
				console,
				bunFileAccesObject,
				solcCache,
			)
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
			 * Load solidity files with @evmts/base
			 * If a .d.ts file or .ts file is pregenerated already (as will be case for external contracts)
			 * go ahead and load that instead
			 */
			build.onLoad({ filter: /\.sol$/ }, async ({ path }) => {
				const filePaths = { dts: `${path}.d.ts`, ts: `${path}.ts` }
				const [dtsExists, tsExists] = await Promise.all(
					Object.values(filePaths).map((filePath) =>
						bunFileAccesObject.exists(filePath),
					),
				)
				if (dtsExists) {
					const filePath = `${path}.d.ts`
					return {
						contents: await bunFileAccesObject.readFile(filePath, 'utf8'),
						watchFiles: [filePath],
					}
				}
				if (tsExists) {
					const filePath = `${path}.ts`
					return {
						contents: await bunFileAccesObject.readFile(filePath, 'utf8'),
						watchFiles: [filePath],
					}
				}

				const resolveBytecode = path.endsWith('.s.sol')

				const { code: contents, modules } =
					await moduleResolver.resolveEsmModule(
						path,
						process.cwd(),
						false,
						resolveBytecode,
					)

				const watchFiles = Object.values(modules)
					.filter(({ id }) => !id.includes('node_modules'))
					.map(({ id }) => id)

				return { contents, watchFiles }
			})
		},
	}
}
