import { bundler, getContractPath } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { defaultConfig, loadConfig } from '@tevm/config'
import { createSolc } from '@tevm/solc'
import { catchTag, logWarning, map, runSync } from 'effect/Effect'
import defaultSolc from 'solc'
import { requirejsFileAccessObject } from './requirejsFileAccessObject.js'

/**
 * RequireJS loader plugin for Tevm that enables direct Solidity imports in JavaScript and TypeScript.
 *
 * This plugin allows you to load Solidity contracts as RequireJS modules, where they are automatically
 * compiled and transformed into Tevm `Contract` instances with fully typed interfaces. It integrates
 * with the RequireJS loader system to provide seamless handling of .sol files.
 *
 * The plugin implements the RequireJS loader plugin API with `load` and `normalize` methods.
 *
 * @param {Object} [options={}] - Plugin configuration options
 * @param {import("@tevm/solc").SolcVersions} [options.solc] - Solidity compiler version to use
 * @returns {Object} A RequireJS loader plugin with load and normalize methods
 *
 * @example
 * #### Setup in RequireJS configuration
 * ```javascript
 * // Configure RequireJS
 * requirejs.config({
 *   paths: {
 *     'tevm-sol': 'node_modules/@tevm/requirejs-plugin/dist/requirejsPluginTevm'
 *   }
 * });
 *
 * // Load a Solidity contract
 * define(['tevm-sol!./contracts/Counter.sol'], function(Counter) {
 *   console.log('ABI:', Counter.abi);
 *   console.log('Bytecode:', Counter.bytecode);
 * });
 * ```
 *
 * @example
 * #### With specific compiler version
 * ```javascript
 * // In your build config or preload script
 * import { requirejsPluginTevm } from '@tevm/requirejs'
 *
 * // Create plugin with specific solc version
 * const plugin = requirejsPluginTevm({ solc: '0.8.20' })
 *
 * // Register with RequireJS
 * define('tevm-sol', [], function() { return plugin })
 * ```
 *
 * @example
 * #### Using imported Solidity contracts
 * ```javascript
 * // Load contracts with RequireJS
 * require(['tevm-sol!@openzeppelin/contracts/token/ERC20/ERC20.sol', 'tevm'],
 *   function(ERC20, tevm) {
 *     const client = tevm.createMemoryClient()
 *
 *     // Deploy the contract
 *     client.deployContract(ERC20, ["My Token", "MTK"]).then(deployed => {
 *       // Interact with the contract
 *       return deployed.read.name()
 *     }).then(name => {
 *       console.log('Token name:', name)
 *     })
 *   }
 * )
 * ```
 *
 * ### How it works
 *
 * Under the hood, the plugin processes Solidity files and generates JavaScript modules
 * that create Tevm Contract instances. For example, loading ERC20.sol results in code like:
 *
 * ```javascript
 * define(['@tevm/contract'], function(tevmContract) {
 *   return tevmContract.createContract({
 *     name: 'ERC20',
 *     humanReadableAbi: [ 'function balanceOf(address): uint256', ... ],
 *     bytecode: '0x...',
 *     deployedBytecode: '0x...',
 *   })
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
 *   "foundryProject": true,       // Is this a Foundry project?
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
 * @see {@link https://requirejs.org/docs/plugins.html | RequireJS Loader Plugin API}
 * @see {@link https://tevm.sh/learn/solidity-imports/ | Tevm Solidity Import Documentation}
 */
export const requirejsPluginTevm = ({ solc = defaultSolc.version } = {}) => {
	// Lazy initialization - these are created on first load
	/**
	 * @type {ReturnType<typeof bundler> | null}
	 */
	let moduleResolver = null
	/**
	 * @type {import("@tevm/config").ResolvedCompilerConfig | null}
	 */
	let config = null
	let initialized = false

	/**
	 * Initialize the plugin by loading configuration and setting up the bundler
	 * @returns {Promise<void>}
	 */
	const initialize = async () => {
		if (initialized) return

		// Load configuration from tevm.config.json or use defaults
		config = runSync(
			loadConfig(process.cwd()).pipe(
				catchTag('FailedToReadConfigError', () =>
					logWarning('Unable to find tevm.config.json. Using default config.').pipe(map(() => defaultConfig)),
				),
			),
		)

		// Initialize cache and bundler
		const solcCache = createCache(config.cacheDir, requirejsFileAccessObject, process.cwd())
		const contractPackage = getContractPath(process.cwd())
		const versionedSolc = solc === defaultSolc.version ? defaultSolc : await createSolc(solc)

		moduleResolver = bundler(config, console, requirejsFileAccessObject, versionedSolc, solcCache, contractPackage)

		initialized = true
	}

	return {
		/**
		 * Normalizes the resource name for optimal caching and optimization.
		 * This is called by RequireJS to normalize module names before loading.
		 *
		 * @param {string} name - The resource name to normalize
		 * @param {Function} normalize - RequireJS normalize function for resolving relative paths
		 * @returns {string} The normalized resource name
		 */
		normalize: (name, normalize) => {
			// Use RequireJS's built-in normalization for path resolution
			return normalize(name)
		},

		/**
		 * Loads a Solidity file and returns the compiled module code.
		 * This is the main method called by RequireJS when a module is requested.
		 *
		 * @param {string} name - The normalized resource name (path to .sol file)
		 * @param {{ toUrl: (path: string) => string }} req - RequireJS local require function with toUrl method
		 * @param {{ fromText: (text: string) => void, error: (err: Error) => void }} onload - Callback to call with the loaded value or error
		 * @param {any} _config - RequireJS configuration object (unused)
		 * @returns {Promise<void>}
		 */
		load: async (name, req, onload, _config) => {
			try {
				// Initialize on first load
				await initialize()

				// Resolve the full path to the .sol file
				const fullPath = req.toUrl(name)

				// Check for pre-generated files (.sol.ts, .sol.js, etc.)
				const filePaths = [`${fullPath}.ts`, `${fullPath}.js`, `${fullPath}.mjs`, `${fullPath}.cjs`]
				const existsArr = await Promise.all(filePaths.map((filePath) => requirejsFileAccessObject.exists(filePath)))

				for (const [i, exists] of existsArr.entries()) {
					if (exists) {
						// If a pre-generated file exists, load it directly
						const contents = await requirejsFileAccessObject.readFile(/** @type {any} */ (filePaths[i]), 'utf8')
						// Use onload.fromText to evaluate the module code
						onload.fromText(contents)
						return
					}
				}

				// Determine if this is a script (.s.sol) file, which needs bytecode
				const resolveBytecode = fullPath.endsWith('.s.sol')

				// Compile the Solidity file
				if (!moduleResolver) {
					throw new Error('Module resolver not initialized')
				}
				const { code: contents } = await moduleResolver.resolveEsmModule(
					fullPath,
					process.cwd(),
					false, // Don't include AST
					resolveBytecode, // Include bytecode for script files
				)

				// Use onload.fromText to evaluate the compiled module code
				onload.fromText(contents)
			} catch (error) {
				// RequireJS error handling - call onload.error
				onload.error(error instanceof Error ? error : new Error(String(error)))
			}
		},
	}
}
