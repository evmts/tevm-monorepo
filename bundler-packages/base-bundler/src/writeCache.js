/**
 * Writes the result of a bundler result to cache
 * @param {import('./types.js').Logger} logger
 * @param {import('@tevm/bundler-cache').Cache} cache
 * @param {import('@tevm/compiler').ResolvedArtifacts} artifacts
 * @param {string} code
 * @param {string} modulePath
 * @param {string} moduleType
 * @param {boolean} writeArtifacts
 * @returns {Promise<void>}
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
