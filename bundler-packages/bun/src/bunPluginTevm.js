import { bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { defaultConfig, loadConfig } from '@tevm/config'
import { createSolc } from '@tevm/solc'
import { catchTag, logWarning, map, runSync } from 'effect/Effect'
// @ts-expect-error
import defaultSolc from 'solc'
import { bunFileAccesObject } from './bunFileAccessObject.js'

/**
 * Creates a Bun plugin for Tevm that enables direct Solidity imports in JavaScript and TypeScript.
 *
 * This plugin allows you to import Solidity contracts directly in your JavaScript/TypeScript code,
 * where they are automatically compiled and transformed into Tevm `Contract` instances with
 * fully typed interfaces. It integrates with the Bun build system to provide seamless handling
 * of .sol files.
 *
 * @param {Object} options - Plugin configuration options
 * @param {import("@tevm/solc").SolcVersions} [options.solc] - Solidity compiler version to use
 * @returns {import("bun").BunPlugin} - A configured Bun plugin
 *
 * @example
 * #### Setup in a plugin.ts file
 * ```typescript
 * // plugins.ts
 * import { bunPluginTevm } from '@tevm/bun'
 * import { plugin } from 'bun'
 *
 * // Initialize with default options
 * plugin(bunPluginTevm({}))
 *
 * // Or with a specific Solidity compiler version
 * plugin(bunPluginTevm({ solc: '0.8.20' }))
 * ```
 *
 * #### Configure in bunfig.toml
 * ```toml
 * # bunfig.toml
 * preload = ["./plugins.ts"]
 * ```
 *
 * #### Configure TypeScript support in tsconfig.json
 * For editor integration with LSP (code completion, type checking):
 * ```json
 * {
 *   "compilerOptions": {
 *     "plugins": [{ "name": "tevm/ts-plugin" }]
 *   }
 * }
 * ```
 *
 * #### Using imported Solidity contracts
 * ```typescript
 * // Import Solidity contracts directly
 * import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol'
 * import { createMemoryClient } from 'tevm'
 *
 * // Access contract metadata
 * console.log('ABI:', ERC20.abi)
 * console.log('Human-readable ABI:', ERC20.humanReadableAbi)
 * console.log('Bytecode:', ERC20.bytecode)
 *
 * // Deploy and interact with the contract
 * const client = createMemoryClient()
 *
 * // Deploy the contract
 * const deployed = await client.deployContract(ERC20)
 *
 * // Call contract methods
 * const name = await deployed.read.name()
 * const tx = await deployed.write.transfer(
 *   "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
 *   1000n
 * )
 * ```
 *
 * ### How it works
 *
 * Under the hood, the plugin processes Solidity files and generates JavaScript modules
 * that create Tevm Contract instances. For example, importing ERC20.sol results in code
 * like:
 *
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
 * ### Custom Configuration
 *
 * For custom configuration of the Tevm compiler, add a `tevm.config.json` file
 * to your project root:
 *
 * ```json
 * {
 *   "foundryProject": true,       // Is this a Foundry project? (or path to project)
 *   "libs": ["lib"],              // Library directories
 *   "remappings": {               // Import remappings (like in Foundry)
 *     "foo": "vendored/foo"
 *   },
 *   "debug": true,                // Enable debug logging
 *   "cacheDir": ".tevm"           // Cache directory for compiled contracts
 * }
 * ```
 *
 * @throws {Error} If there's an issue loading or processing Solidity files
 *
 * @see {@link https://tevm.sh/learn/solidity-imports/ | Tevm Solidity Import Documentation}
 */
export const bunPluginTevm = ({ solc = defaultSolc.version }) => {
	return {
		name: '@tevm/bun-plugin',
		async setup(build) {
			// Load configuration from tevm.config.json or use defaults
			const config = runSync(
				loadConfig(process.cwd()).pipe(
					catchTag('FailedToReadConfigError', () =>
						logWarning('Unable to find tevm.config.json. Using default config.').pipe(map(() => defaultConfig)),
					),
				),
			)

			// Initialize cache and bundler
			const solcCache = createCache(config.cacheDir, bunFileAccesObject, process.cwd())
			const moduleResolver = bundler(
				config,
				console,
				bunFileAccesObject,
				solc === defaultSolc.version ? defaultSolc : await createSolc(solc),
				solcCache,
			)

			/**
			 * Resolver for @tevm/contract imports
			 *
			 * This resolver ensures that @tevm/contract is correctly resolved
			 * when imported from compiled Solidity files that might be in different
			 * locations (node_modules, monorepo packages, etc.)
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
			 * Loader for Solidity (.sol) files
			 *
			 * This loader:
			 * 1. Checks if pre-generated JavaScript/TypeScript files exist (.ts, .js, .mjs, .cjs)
			 * 2. If they exist, uses those directly
			 * 3. Otherwise, compiles the Solidity file using the bundler
			 * 4. Sets up file watching for live reload
			 */
			build.onLoad({ filter: /\.sol$/ }, async ({ path }) => {
				// Check for pre-generated files
				const filePaths = [`${path}.ts`, `${path}.js`, `${path}.mjs`, `${path}.cjs`]
				const existsArr = await Promise.all(filePaths.map((filePath) => bunFileAccesObject.exists(filePath)))
				for (const [i, exists] of existsArr.entries()) {
					if (exists) {
						return {
							contents: await bunFileAccesObject.readFile(/** @type {any} */ (filePaths[i]), 'utf8'),
							watchFiles: [filePaths[i]],
						}
					}
				}

				// Determine if this is a script (.s.sol) file, which needs bytecode
				const resolveBytecode = path.endsWith('.s.sol')

				// Compile the Solidity file
				const { code: contents, modules } = await moduleResolver.resolveEsmModule(
					path,
					process.cwd(),
					false, // Don't include AST
					resolveBytecode, // Include bytecode for script files
				)

				// Set up file watching for all non-node_modules dependencies
				const watchFiles = Object.values(modules)
					.filter(({ id }) => !id.includes('node_modules'))
					.map(({ id }) => id)

				return { contents, watchFiles }
			})
		},
	}
}
