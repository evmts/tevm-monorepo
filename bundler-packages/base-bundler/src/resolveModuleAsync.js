import { resolveArtifacts } from '@tevm/compiler'
import { generateRuntime } from '@tevm/runtime'
import { runPromise } from 'effect/Effect'
import { readCache } from './readCache.js'
import { writeCache } from './writeCache.js'

/**
 * Asynchronously resolves a Solidity module to the specified module format.
 *
 * This function is the core of the bundler's module resolution process. It:
 * 1. Attempts to read from cache first
 * 2. If not cached, compiles the Solidity source and generates artifacts
 * 3. Generates code for the requested module type (dts, mjs, etc.)
 * 4. Writes results to cache (without blocking the resolution)
 * 5. Returns the bundler result
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
 * @returns {Promise<import('./types.js').BundlerResult>} A promise that resolves to a bundler result object
 * @throws {Error} - Throws if compilation or code generation fails
 *
 * @example
 * ```javascript
 * import { resolveModuleAsync } from '@tevm/base-bundler'
 * import { createCache } from '@tevm/bundler-cache'
 * import { createSolc } from '@tevm/solc'
 * import { loadConfig } from '@tevm/config'
 * import { mkdir, readFile, writeFile } from 'fs/promises'
 * import { existsSync, statSync } from 'fs'
 *
 * // Setup dependencies
 * const config = await loadConfig()
 * const solc = await createSolc()
 * const cache = createCache()
 * const logger = console
 *
 * // File access object
 * const fao = {
 *   readFile: (path, encoding) => readFile(path, { encoding }),
 *   writeFile,
 *   exists: async (path) => existsSync(path),
 *   existsSync,
 *   statSync,
 *   mkdir
 *   // Include other required methods
 * }
 *
 * // Resolve a Solidity file to a TypeScript declaration file
 * const result = await resolveModuleAsync(
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
export const resolveModuleAsync = async (
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
	const cachedResult = await readCache(logger, cache, modulePath, includeAst, includeBytecode)
	try {
		const { solcInput, solcOutput, asts, artifacts, modules } =
			cachedResult ??
			(await resolveArtifacts(modulePath, basedir, logger, config, includeAst, includeBytecode, fao, solc))
		let code = ''
		const artifactsExist = artifacts && Object.keys(artifacts).length > 0
		if (artifactsExist) {
			code = await runPromise(generateRuntime(artifacts, moduleType, includeBytecode, contractPackage))
		} else {
			const message = `there were no artifacts for ${modulePath}. This is likely a bug in tevm`
			code = `// ${message}`
			logger.warn(message)
		}

		// The `writeCache` function is intentionally not awaited to allow non-blocking cache writes.
		// This enables the rest of the module resolution to proceed without waiting for the cache operation to complete.
		writeCache(
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
		).catch((e) => {
			logger.error(e)
			logger.error('there was an error writing to the cache. This may cause peformance issues')
		})

		return {
			solcInput,
			solcOutput,
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
