import { createRequire } from 'node:module'
import { bundler, getContractPath } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { defaultConfig, loadConfig } from '@tevm/config'
import { createSolc, releases } from '@tevm/solc'
import { catchTag, logWarning, map, runPromise } from 'effect/Effect'
// @ts-expect-error
import defaultSolc from 'solc'
import { z } from 'zod'
import { fao } from './fao.js'

// Extract the default solc version without commit hash
const defaultVersion = defaultSolc.version().slice(0, defaultSolc.version().indexOf('+'))

/**
 * Zod schema for validating solc compiler versions.
 * This ensures that users only specify supported solc versions.
 *
 * @type {import("zod").ZodSchema<import('@tevm/solc').SolcVersions>}
 */
const compilerOptionValidator = z
	.union(
		/**
		 * @type {any}
		 */
		(Object.keys(releases).map((release) => z.literal(release))),
	)
	.default(defaultVersion)
	.describe(`Solc compiler version to use. Defaults to ${defaultVersion}}`)

/**
 * Type definition for the compiler option from the zod schema.
 * @typedef {import("zod").infer<typeof compilerOptionValidator>} CompilerOption
 */

/**
 * Available bundler implementations.
 * Currently only solc is supported, but this could be extended in the future.
 */
const bundlers = {
	solc: bundler,
}

/**
 * Creates a universal plugin factory for integrating Tevm Solidity imports into
 * various build tools like Webpack, Rollup, Vite, etc.
 *
 * This is the core implementation shared by all Tevm build plugins. It handles:
 * - Loading and parsing Solidity files
 * - Compiling them with the specified solc version
 * - Transforming them into JavaScript modules with typed Contract objects
 * - Resolving imports and dependencies
 * - Setting up file watching for rebuilds
 *
 * The plugin can be configured with options for the Solidity compiler version.
 *
 * @type {import("unplugin").UnpluginFactory<{solc?: CompilerOption } | undefined, false>}
 *
 * @example
 * ```typescript
 * import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'
 *
 * // Create a Rollup plugin
 * const rollupPlugin = createUnplugin(tevmUnplugin).rollup({
 *   solc: '0.8.19' // Use a specific solc version
 * })
 *
 * // Create a Webpack plugin
 * const webpackPlugin = createUnplugin(tevmUnplugin).webpack()
 * ```
 *
 * @param {Object} [options={}] - Plugin options
 * @param {CompilerOption} [options.solc] - Solidity compiler version to use
 * @returns {import("unplugin").UnpluginInstance} - Universal plugin instance
 * @throws {Error} If an invalid solc version is specified
 */
export const tevmUnplugin = (options = {}) => {
	/**
	 * Tevm compiler configuration, loaded from tevm.config.json
	 * @type {import("@tevm/config").ResolvedCompilerConfig}
	 */
	let config

	// Validate the solc version
	const parsedSolcVersion = compilerOptionValidator.safeParse(options.solc)
	if (!parsedSolcVersion.success) {
		console.error(parsedSolcVersion.error)
		throw new Error(`Invalid solc compiler passed to Tevm plugin'`)
	}

	// Select the bundler implementation (currently only solc is supported)
	const bundler = bundlers.solc
	/**
	 * Module resolver instance used to transform Solidity imports
	 * @type {ReturnType<typeof bundler>}
	 */
	let moduleResolver

	return {
		name: '@tevm/unplugin',
		/**
		 * Make this plugin run before other plugins to handle .sol files
		 * before other plugins encounter them
		 */
		enforce: 'pre',

		/**
		 * Called at the start of the build process to initialize the plugin
		 */
		async buildStart() {
			// Load Tevm configuration
			config = await runPromise(
				loadConfig(process.cwd()).pipe(
					catchTag('FailedToReadConfigError', () =>
						logWarning('Unable to find tevm.config.json. Using default config.').pipe(map(() => defaultConfig)),
					),
				),
			)

			// Set up cache and bundler
			const solcCache = createCache(config.cacheDir, fao, process.cwd())
			const contractPackage = getContractPath(process.cwd())

			// Get the appropriate solc compiler based on version
			const versionedSolc =
				parsedSolcVersion.data === defaultVersion ? defaultSolc : await createSolc(parsedSolcVersion.data)

			// Initialize the module resolver
			moduleResolver = bundler(config, console, fao, versionedSolc, solcCache, contractPackage)
		},

		/**
		 * Determines whether a file should be handled by this plugin
		 * @param {string} id - Module ID (file path)
		 * @returns {boolean} - True if this plugin should process the file
		 */
		loadInclude: (id) => {
			// Process .sol files that don't already have a TypeScript definition
			return id.endsWith('.sol') && !fao.existsSync(`${id}.ts`) && !fao.existsSync(`${id}.d.ts`)
		},

		/**
		 * Resolves module imports to ensure correct paths
		 * @param {string} id - Import identifier
		 * @param {string} [importer] - Importing module
		 * @returns {Promise<string|null>} - Resolved path or null
		 */
		async resolveId(id, importer) {
			// Ensure @tevm/contract always resolves to the local version
			// This handles imports from node_modules or different workspaces
			if (
				id.startsWith('@tevm/contract') &&
				!importer?.startsWith(process.cwd()) &&
				!importer?.includes('node_modules')
			) {
				return createRequire(`${process.cwd()}/`).resolve('@tevm/contract')
			}
			return null
		},

		/**
		 * Loads and transforms Solidity files into JavaScript modules
		 * @param {string} id - Module ID (file path)
		 * @returns {Promise<string>} - Transformed JavaScript code
		 */
		async load(id) {
			// Check if this is a script file that needs bytecode
			const resolveBytecode = id.endsWith('.s.sol')

			// Generate ESM code from the Solidity file
			const { code, modules } = await moduleResolver.resolveEsmModule(
				id, // File path
				process.cwd(), // Current working directory
				false, // Don't include AST (reduces bundle size)
				resolveBytecode, // Include bytecode for script files
			)

			// Set up file watching for all dependencies except node_modules
			Object.values(modules).forEach((module) => {
				if (module.id.includes('node_modules')) {
					return
				}
				this.addWatchFile(module.id)
			})

			return code
		},

		// Plugin version
		...{ version: '0.11.2' },
	}
}
