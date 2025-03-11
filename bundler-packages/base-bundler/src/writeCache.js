/**
 * Writes compilation artifacts and generated code to the cache asynchronously.
 * This function can selectively write artifacts based on the provided flag,
 * and it also writes the generated TypeScript or JavaScript code to the
 * appropriate cache location based on the module type.
 *
 * @param {import('./types.js').Logger} logger - Logger for warning and error reporting
 * @param {import('@tevm/bundler-cache').Cache} cache - Cache instance to write to
 * @param {import('@tevm/compiler').ResolvedArtifacts} artifacts - The compilation artifacts to cache
 * @param {string} code - The generated code content
 * @param {string} modulePath - Path to the Solidity module
 * @param {string} moduleType - Type of module to generate ('dts', 'mjs', 'cjs', 'ts')
 * @param {boolean} writeArtifacts - Whether to write compilation artifacts to cache
 *   This is typically set to false if there was a compilation error, but we still
 *   want to cache error messages in the generated files.
 * @returns {Promise<void>} - A promise that resolves when writing is complete
 * @throws {Error} - Doesn't directly throw, but logs warnings for unsupported module types
 *
 * @example
 * ```javascript
 * import { writeCache } from '@tevm/base-bundler'
 * import { createCache } from '@tevm/bundler-cache'
 *
 * const cache = createCache()
 * const logger = console
 *
 * // After compilation, write results to cache
 * await writeCache(
 *   logger,
 *   cache,
 *   compilationResult, // artifacts from solc compilation
 *   generatedTypeScript, // the generated code
 *   './contracts/Counter.sol',
 *   'dts', // writing .d.ts file
 *   true // write artifacts too
 * )
 * ```
 */
export const writeCache = async (
	logger,
	cache,
	artifacts,
	code,
	modulePath,
	moduleType,
	// This is kinda quick and dirty but works for now
	// we will skip writing artifacts if there is an error
	// but still write dts and mjs files since they always
	// fall back to generating an empty file with error messages
	writeArtifacts,
) => {
	/**
	 * @type {Array<Promise<any>>}
	 */
	const promises = []
	if (writeArtifacts) {
		promises.push(cache.writeArtifacts(modulePath, artifacts))
	}
	if (moduleType === 'dts') {
		promises.push(cache.writeDts(modulePath, code))
	} else if (moduleType === 'mjs') {
		promises.push(cache.writeMjs(modulePath, code))
	} else {
		logger.warn(`No caching for module type ${moduleType}} implemented yet`)
	}
	await Promise.all(promises)
}
