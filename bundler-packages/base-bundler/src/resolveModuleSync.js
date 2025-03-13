import { resolveArtifactsSync } from '@tevm/compiler'
import { generateRuntime } from '@tevm/runtime'
import { runSync } from 'effect/Effect'
import { readCacheSync } from './readCacheSync.js'
import { writeCacheSync } from './writeCacheSync.js'

/**
 * Synchronously resolves a Solidity module to the specified module format.
 *
 * This is the synchronous counterpart to resolveModuleAsync, which:
 * 1. Attempts to read from cache first
 * 2. If not cached, compiles the Solidity source and generates artifacts
 * 3. Generates code for the requested module type (dts, mjs, etc.)
 * 4. Writes results to cache
 * 5. Returns the bundler result
 *
 * This synchronous version is primarily used for TypeScript compiler plugins
 * which require synchronous operations.
 *
 * @param {import('@tevm/compiler').Logger} logger - Logger for error reporting
 * @param {import('@tevm/config').ResolvedCompilerConfig} config - Compiler configuration
 * @param {import('@tevm/compiler').FileAccessObject} fao - File system access object
 * @param {import('@tevm/solc').Solc} solc - Solidity compiler instance
 * @param {string} modulePath - Path to the Solidity module
 * @param {string} basedir - Base directory for resolving relative paths
 * @param {boolean} includeAst - Whether to include AST in the result
 * @param {boolean} includeBytecode - Whether to include bytecode in the result
 * @param {import('@tevm/runtime').ModuleType} moduleType - Type of module to generate ('dts', 'mjs', 'cjs', 'ts')
 * @param {import('@tevm/bundler-cache').Cache} cache - Cache instance for artifacts
 * @param {'tevm/contract' | '@tevm/contract'} contractPackage - Contract package name to import in generated code
 * @returns {import('./types.js').BundlerResult} A bundler result object
 * @throws {Error} - Throws if compilation or code generation fails
 *
 * @example
 * ```javascript
 * import { resolveModuleSync } from '@tevm/base-bundler'
 * import { createCache } from '@tevm/bundler-cache'
 * import { createSolc } from '@tevm/solc'
 * import { loadConfig } from '@tevm/config'
 * import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'fs'
 *
 * // Setup dependencies
 * const config = loadConfigSync() // Hypothetical sync config loader
 * const solc = createSolcSync() // Hypothetical sync solc creator
 * const cache = createCache()
 * const logger = console
 *
 * // File access object
 * const fao = {
 *   readFileSync,
 *   writeFileSync,
 *   existsSync,
 *   statSync,
 *   mkdirSync,
 *   // Include other required methods
 * }
 *
 * // Resolve a Solidity file to a TypeScript declaration file
 * const result = resolveModuleSync(
 *   logger,
 *   config,
 *   fao,
 *   solc,
 *   './contracts/Counter.sol',
 *   process.cwd(),
 *   true,  // include AST
 *   true,  // include bytecode
 *   'dts', // generate .d.ts file
 *   cache,
 *   '@tevm/contract'
 * )
 *
 * console.log(result.code) // Generated TypeScript declarations
 * ```
 */
export const resolveModuleSync = (
	logger,
	config,
	fao,
	solc,
	modulePath,
	basedir,
	includeAst,
	includeBytecode,
	moduleType,
	cache,
	contractPackage,
) => {
	const cachedResult = readCacheSync(logger, cache, modulePath, includeAst, includeBytecode)
	try {
		const { solcInput, solcOutput, asts, artifacts, modules } =
			cachedResult ?? resolveArtifactsSync(modulePath, basedir, logger, config, includeAst, includeBytecode, fao, solc)
		let code = ''
		const artifactsExist = artifacts && Object.keys(artifacts).length > 0
		if (artifactsExist) {
			code = runSync(generateRuntime(artifacts, moduleType, includeBytecode, contractPackage))
		} else {
			const message = `there were no artifacts for ${modulePath}. This is likely a bug in tevm`
			code = `// ${message}`
			logger.warn(message)
		}

		writeCacheSync(
			logger,
			cache,
			{ solcInput, solcOutput, asts, artifacts, modules },
			code,
			modulePath,
			moduleType,
			// This is kinda quick and dirty but works for now
			// We are skipping writing artifacts if there is an error
			// But still write dts and mjs files since they always
			// fall back to generating an empty file with error messages
			artifactsExist,
		)

		return {
			solcInput: solcInput ?? undefined,
			solcOutput: solcOutput ?? undefined,
			asts,
			modules,
			code,
		}
	} catch (e) {
		logger.error(`there was an error in tevm plugin resolving .${moduleType}`)
		logger.error(/** @type any */ (e))
		throw e
	}
}
