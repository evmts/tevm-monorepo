/**
 * Reads Solidity compilation artifacts from the cache asynchronously.
 * This function checks if cached artifacts exist and if they satisfy the requested
 * AST and bytecode inclusion requirements.
 *
 * @param {import('@tevm/compiler').Logger} logger - Logger for error reporting
 * @param {import('@tevm/bundler-cache').Cache} cache - Cache instance to read from
 * @param {string} modulePath - Path to the Solidity module
 * @param {boolean} includeAst - Whether to include AST in the result
 * @param {boolean} includeBytecode - Whether to include bytecode in the result
 * @returns {ReturnType<import('@tevm/bundler-cache').Cache['readArtifacts']>} - The cached artifacts if found and valid, otherwise undefined
 * @throws {Error} - Doesn't throw, but logs errors and returns undefined on failure
 *
 * @example
 * ```javascript
 * import { readCache } from '@tevm/base-bundler'
 * import { createCache } from '@tevm/bundler-cache'
 *
 * const cache = createCache()
 * const logger = console
 *
 * // Read artifacts for Counter.sol
 * const artifacts = await readCache(
 *   logger,
 *   cache,
 *   './contracts/Counter.sol',
 *   true, // include AST
 *   true  // include bytecode
 * )
 *
 * if (artifacts) {
 *   console.log('Cache hit! Using cached artifacts')
 * } else {
 *   console.log('Cache miss. Need to recompile')
 * }
 * ```
 */
export const readCache = async (logger, cache, modulePath, includeAst, includeBytecode) => {
	try {
		const cachedArtifacts = await cache.readArtifacts(modulePath)

		const isCachedAsts = () => cachedArtifacts?.asts && Object.keys(cachedArtifacts.asts).length > 0
		const isCachedBytecode = () =>
			Object.values(cachedArtifacts?.artifacts ?? {}).some((artifact) => artifact.evm.deployedBytecode)

		if (!cachedArtifacts) {
			return undefined
		}
		if (includeAst && !isCachedAsts()) {
			return undefined
		}
		if (includeBytecode && !isCachedBytecode()) {
			return undefined
		}
		return cachedArtifacts
	} catch (e) {
		logger.error(
			`there was an error in tevm plugin reading cache for ${modulePath}. Continuing without cache. This may hurt performance`,
		)
		logger.error(/** @type any */ (e))
		return undefined
	}
}
