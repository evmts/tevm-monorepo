/**
 * @param {import('@tevm/compiler').Logger} logger
 * @param {import('@tevm/bundler-cache').Cache} cache
 * @param {string} modulePath
 * @param {boolean} includeAst
 * @param {boolean} includeBytecode
 * @returns {ReturnType<import('@tevm/bundler-cache').Cache['readArtifacts']>}
 */
export const readCache = async (
	logger,
	cache,
	modulePath,
	includeAst,
	includeBytecode,
) => {
	try {
		const cachedArtifacts = await cache.readArtifacts(modulePath)

		const isCachedAsts = () =>
			cachedArtifacts?.asts && Object.keys(cachedArtifacts.asts).length > 0
		const isCachedBytecode = () =>
			Object.values(cachedArtifacts?.artifacts ?? {}).some(
				(artifact) => artifact.evm.deployedBytecode,
			)

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
