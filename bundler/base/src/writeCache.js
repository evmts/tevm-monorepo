/**
 * @param {import('./types.js').Logger} logger
 * @param {import('@tevm/bundler-cache').Cache} cache
 * @param {import('@tevm/compiler').ResolvedArtifacts} artifacts
 * @param {string} code
 * @param {string} modulePath
 * @param {string} moduleType
 */
export const writeCache = (
	logger,
	cache,
	artifacts,
	code,
	modulePath,
	moduleType,
) => {
	cache.writeArtifacts(modulePath, artifacts)
	if (moduleType === 'dts') {
		cache.writeDts(modulePath, code)
	} else if (moduleType === 'mjs') {
		cache.writeMjs(modulePath, code)
	} else {
		logger.warn(`No caching for module type ${moduleType}} implemented yet`)
	}
}
