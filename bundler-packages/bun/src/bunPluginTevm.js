import { bunFileAccesObject } from './bunFileAccessObject.js'
import { bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { defaultConfig, loadConfig } from '@tevm/config'
import { createSolc } from '@tevm/solc'
import { catchTag, logWarning, map, runSync } from 'effect/Effect'
// @ts-expect-error
import defaultSolc from 'solc'

/**
 * Bun plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
 * will transform solidity contract imports into Tevm `Contract` instances.
 * @param {{solc?: import("@tevm/solc").SolcVersions}} SolcVersions - Which solc version to use
 * @returns {import("bun").BunPlugin} - A bun plugin
 *
 * To configure add this plugin to your Bun config and add the ts-plugin to your tsconfig.json
 * @example
 * ```ts plugin.ts
 * // Configure plugin in a plugin.ts file
 * import { tevmPluginBun } from '@tevm/bun-plugin'
 * import { plugin } from 'bun'
 *
 * plugin(tevmPluginBun())
 * ```
 *
 * // Add the plugin.ts to your bunfig.toml
 * ```ts bunfig.toml
 * preload = ["./plugins.ts"]
 * ```
 *
 * For LSP so your editor recognizes the solidity imports correctly you must also configure tevm/ts-plugin in your tsconfig.json
 * The ts-plugin will provide type hints, code completion, and other features.
 * @example
 * ```json
 * {
 *   "compilerOptions": {
 *     "plugins": [{ "name": "tevm/ts-plugin" }]
 *   }
 * }
 * ```
 *
 * Once the esbuild plugin and the ts-plugin are configured, you can import Solidity files in JavaScript. The compiler will
 * turn them into Tevm `Contract` instances.
 * @example
 * ```typescript
 * // Solidity imports are automaticlaly turned into Tevm Contract objects
 * import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol'
 * import { createTevm } from 'tevm'
 *
 * console.log(ERC20.abi)
 * console.log(ERC20.humanReadableAbi)
 * console.log(ERC20.bytecode)
 *
 * tevm.contract(
 *   ERC20.withAddress(.read.balanceOf()
 * )
 * ```
 *
 * Under the hood the esbuild plugin is creating a virtual file for ERC20.sol called ERC20.sol.cjs that looks like this
 * @example
 * ```typescript
 * import { createContract } from '@tevm/contract'
 *
 * export const ERC20 = createContract({
 *   name: 'ERC20',
 *   humanReadableAbi: [ 'function balanceOf(address): uint256', ... ],
 *   bytecode: '0x...',
 *   deployedBytecode: '0x...',
 * })
 * ```
 *
 * For custom configuration of the Tevm compiler add a [tevm.config.json](https://todo.todo.todo) file to your project root.
 * @example
 * ```json
 * {
 *   foundryProject?: boolean | string | undefined,
 *   libs: ['lib'],
 *   remappings: {'foo': 'vendored/foo'},
 *   debug: true,
 *   cacheDir: '.tevm'
 * }
 * ```
 *
 * @see [Tevm esbuild example](https://todo.todo.todo)
 */
export const bunPluginTevm = ({ solc = defaultSolc.version }) => {
	return {
		name: '@tevm/esbuild-plugin',
		async setup(build) {
			const config = runSync(
				loadConfig(process.cwd()).pipe(
					catchTag('FailedToReadConfigError', () =>
						logWarning(
							'Unable to find tevm.config.json. Using default config.',
						).pipe(map(() => defaultConfig)),
					),
				),
			)
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
			build.onResolve({ filter: /^@tevm\/contract/ }, ({ path, importer }) => {
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
			 * Load solidity files with @tevm/base-bundler
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
