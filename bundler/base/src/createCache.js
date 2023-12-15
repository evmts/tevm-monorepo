/**
 * @typedef {import('./createCache.js').Cache} Cache

/**
 * @type {import('./createCache.js').CreateCache}
 */
export const createCache = (logger, cacheDir, fs, cwd) => {
	/**
	 * @param {string} entryModuleId
	 */
	const getArtifactsPath = (entryModuleId) => {
		const normalizedEntryModuleId = entryModuleId.replace(entryModuleId, cwd)
		// TODO This doesn't support windows
		return [cacheDir, normalizedEntryModuleId, 'artifacts.json'].join('/')
	}

	return {
		write: (entryModuleId, compiledContracts) => {
			const artifactsPath = getArtifactsPath(entryModuleId)
			fs.writeFileSync(artifactsPath, JSON.stringify(compiledContracts))
		},
		read: (entryModuleId) => {
			const artifactsPath = getArtifactsPath(entryModuleId)
			if (!fs.existsSync(artifactsPath)) {
				throw new Error(
					`Cache miss for ${entryModuleId}. Try calling isCached first`,
				)
			}
			try {
				return JSON.parse(fs.readFileSync(artifactsPath, 'utf8').toString())
			} catch (e) {
				throw new Error(
					`Cache miss for ${entryModuleId} because it isn't valid json. Try calling isCached first`,
				)
			}
		},
		isCached: (entryModuleId, sources) => {
			const artifactsPath = getArtifactsPath(entryModuleId)
			if (!fs.existsSync(artifactsPath)) {
				return false
			}
			/**
			 * @type {import('@tevm/solc').SolcOutput}
			 */
			const previousCachedItem = JSON.parse(fs.readFileSync(artifactsPath, 'utf8').toString())
			if (!previousCachedItem) {
				return false
			}
			const { sources: previousSources } = previousCachedItem
			if (Object.keys(sources).length !== Object.keys(previousSources).length) {
				return false
			}
			for (const [key, newSource] of Object.entries(sources)) {
				const oldSource = previousSources[key]
				if (!oldSource) {
					return false
				}
				if (!('content' in oldSource) || !('content' in newSource)) {
					logger.error(
						'Unexpected error: Unable to use cache because content is undefined. Continuing without cache.',
					)
					return false
				}
				if (oldSource.content !== newSource.content) {
					return false
				}
			}
			return true
		},
	}
}
