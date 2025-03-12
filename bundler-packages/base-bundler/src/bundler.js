import { getContractPath } from './getContractPath.js'
import { resolveModuleAsync } from './resolveModuleAsync.js'
import { resolveModuleSync } from './resolveModuleSync.js'

/**
 * Creates a bundler instance for processing Solidity files into JavaScript and TypeScript.
 *
 * The bundler is the core component of Tevm's build system, providing the capability to:
 * - Compile Solidity files to ABI, bytecode, and AST
 * - Generate TypeScript type definitions from the ABI
 * - Generate JavaScript or TypeScript code for importing contracts
 * - Cache compilation results for better performance
 * - Support multiple module formats (ESM, CJS, TypeScript)
 *
 * This base bundler is used by all Tevm build plugins including TypeScript,
 * Webpack, Vite, Bun, ESBuild, and others.
 *
 * @param {import('@tevm/config').ResolvedCompilerConfig} config - The Tevm compiler configuration
 * @param {import('./types.js').Logger} logger - Logger for error and info reporting
 * @param {import('./types.js').FileAccessObject} fao - File system access object for reading/writing files
 * @param {import('@tevm/solc').Solc} solc - Solidity compiler instance
 * @param {import('@tevm/bundler-cache').Cache} cache - Cache instance for build artifacts
 * @param {'tevm/contract' | '@tevm/contract' | undefined} [contractPackage] - Optional contract package name
 * @returns {ReturnType<import('./types.js').Bundler>} A bundler instance with methods for resolving Solidity modules
 *
 * @example
 * ```javascript
 * import { bundler } from '@tevm/base-bundler'
 * import { createCache } from '@tevm/bundler-cache'
 * import { readFile, writeFile } from 'fs/promises'
 * import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'fs'
 * import { mkdir, stat } from 'fs/promises'
 * import { createSolc } from '@tevm/solc'
 * import { loadConfig } from '@tevm/config'
 *
 * // Create a file access object with all required methods
 * const fao = {
 *   // Async methods
 *   readFile: (path, encoding) => readFile(path, { encoding }),
 *   writeFile,
 *   exists: async (path) => existsSync(path),
 *   stat,
 *   mkdir,
 *
 *   // Sync methods
 *   readFileSync: (path, encoding) => readFileSync(path, { encoding }),
 *   writeFileSync,
 *   existsSync,
 *   statSync,
 *   mkdirSync
 * }
 *
 * async function setupBundler() {
 *   // Initialize dependencies
 *   const config = await loadConfig()
 *   const solcCompiler = await createSolc()
 *   const cacheInstance = createCache()
 *
 *   // Create the bundler
 *   const tevmBundler = bundler(
 *     config,
 *     console,
 *     fao,
 *     solcCompiler,
 *     cacheInstance
 *   )
 *
 *   // Process a Solidity file to TypeScript
 *   const result = await tevmBundler.resolveTsModule(
 *     './contracts/ERC20.sol',
 *     process.cwd(),
 *     true,  // include AST
 *     true   // include bytecode
 *   )
 *
 *   console.log(result.code)
 *
 *   // The result contains:
 *   // - code: The generated TypeScript code
 *   // - modules: Information about processed modules
 *   // - solcInput: The input provided to solc
 *   // - solcOutput: The compiler output
 *   // - asts: Abstract Syntax Trees (if requested)
 * }
 *
 * setupBundler().catch(console.error)
 * ```
 */
export const bundler = (config, logger, fao, solc, cache, contractPackage) => {
	const _contractPackage = typeof contractPackage === 'string' ? contractPackage : getContractPath(process.cwd())
	return {
		/** @type {string} */
		name: 'TevmBaseBundler',
		config,
		resolveDts: (
			/** @type {string} */ modulePath,
			/** @type {string} */ basedir,
			/** @type {boolean} */ includeAst,
			/** @type {boolean} */ includeBytecode,
		) =>
			resolveModuleAsync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'dts',
				cache,
				_contractPackage,
			),
		resolveDtsSync: (
			/** @type {string} */ modulePath,
			/** @type {string} */ basedir,
			/** @type {boolean} */ includeAst,
			/** @type {boolean} */ includeBytecode,
		) =>
			resolveModuleSync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'dts',
				cache,
				_contractPackage,
			),
		resolveTsModuleSync: (
			/** @type {string} */ modulePath,
			/** @type {string} */ basedir,
			/** @type {boolean} */ includeAst,
			/** @type {boolean} */ includeBytecode,
		) =>
			resolveModuleSync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'ts',
				cache,
				_contractPackage,
			),
		resolveTsModule: (
			/** @type {string} */ modulePath,
			/** @type {string} */ basedir,
			/** @type {boolean} */ includeAst,
			/** @type {boolean} */ includeBytecode,
		) =>
			resolveModuleAsync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'ts',
				cache,
				_contractPackage,
			),
		resolveCjsModuleSync: (
			/** @type {string} */ modulePath,
			/** @type {string} */ basedir,
			/** @type {boolean} */ includeAst,
			/** @type {boolean} */ includeBytecode,
		) =>
			resolveModuleSync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'cjs',
				cache,
				_contractPackage,
			),
		resolveCjsModule: (
			/** @type {string} */ modulePath,
			/** @type {string} */ basedir,
			/** @type {boolean} */ includeAst,
			/** @type {boolean} */ includeBytecode,
		) =>
			resolveModuleAsync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'cjs',
				cache,
				_contractPackage,
			),
		resolveEsmModuleSync: (
			/** @type {string} */ modulePath,
			/** @type {string} */ basedir,
			/** @type {boolean} */ includeAst,
			/** @type {boolean} */ includeBytecode,
		) =>
			resolveModuleSync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'mjs',
				cache,
				_contractPackage,
			),
		resolveEsmModule: (
			/** @type {string} */ modulePath,
			/** @type {string} */ basedir,
			/** @type {boolean} */ includeAst,
			/** @type {boolean} */ includeBytecode,
		) =>
			resolveModuleAsync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'mjs',
				cache,
				_contractPackage,
			),
	}
}
