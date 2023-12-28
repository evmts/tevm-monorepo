import { bunFileAccesObject } from './bunFileAccessObject.js'
import { bundler } from '@tevm/base'
import { createCache } from '@tevm/bundler-cache'
import { loadConfig } from '@tevm/config'
import { createSolc } from '@tevm/solc'
import { runSync } from 'effect/Effect'
// @ts-expect-error
import defaultSolc from 'solc'

/**
 * @tevm/bun-plugin is a bun plugin that allows you to import solidity files into your typescript files
 * and have them compiled to typescript on the fly.
 * @param {{solc?: import("@tevm/solc").SolcVersions}} SolcVersions
 * @returns {import("bun").BunPlugin}
 * @example
 * ```ts plugin.ts
 * import { tevmBunPlugin } from '@tevm/esbuild-plugin'
 * import { plugin } from 'bun'
 *
 * plugin(tevmBunPlugin())
 * ```
 *
 * ```ts bunfig.toml
 * preload = ["./plugins.ts"]
 * ```
 */
export const tevmBunPlugin = ({ solc = defaultSolc.version }) => {
	return {
		name: '@tevm/esbuild-plugin',
		async setup(build) {
			const config = runSync(loadConfig(process.cwd()))
			const solcCache = createCache(
				config.cacheDir,
				bunFileAccesObject,
				process.cwd(),
			)
			const moduleResolver = bundler(
				config,
				console,
				bunFileAccesObject,
				solc === defaultSolc.version ? defaultSolc : await createSolc(solc),
				solcCache,
			)
			/**
			 * @tevm/contract is used to construct the tevm modules for solidity files
			 * sometimes the solidity file might exist in the node_modules folder
			 * or in a different package in a monorepo. We need to resolve it correctly
			 * in all cases so we always resolve to the current package's @tevm/contract
			 */
			build.onResolve({ filter: /^@tevm\/core/ }, ({ path, importer }) => {
				if (
					path.startsWith('@tevm/contract') &&
					!importer.startsWith(process.cwd()) &&
					!importer.includes('node_modules')
				) {
					return {
						path: require.resolve('@tevm/contract'),
					}
				}
				return {
					path: require.resolve(path),
				}
			})

			/**
			 * Load solidity files with @tevm/base
			 * If a .ts .js file .mjs or .cjs file is pregenerated already (as will be case for external contracts)
			 * go ahead and load that instead
			 */
			build.onLoad({ filter: /\.sol$/ }, async ({ path }) => {
				const filePaths = [
					`${path}.ts`,
					`${path}.js`,
					`${path}.mjs`,
					`${path}.cjs`,
				]
				const existsArr = await Promise.all(
					filePaths.map((filePath) => bunFileAccesObject.exists(filePath)),
				)
				for (const [i, exists] of existsArr.entries()) {
					if (exists) {
						return {
							contents: await bunFileAccesObject.readFile(
								/** @type {any} */ (filePaths[i]),
								'utf8',
							),
							watchFiles: [filePaths[i]],
						}
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
