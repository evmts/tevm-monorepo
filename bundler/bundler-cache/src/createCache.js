/**
 * @type {import('./types.js').CreateCache}
 */
export const createCache = (logger, cacheDir, fs, cwd) => {
	/**
	 * @param {string} entryModuleId
	 * @param {import('./types.js').CachedItem} item
	 */
	const getArtifactsPath = (entryModuleId, item) => {
		const fileName = {
			dts: 'contract.d.ts',
			artifactsJson: 'artifacts.json',
			mjs: 'contract.mjs',
		}[item]
		const normalizedEntryModuleId = entryModuleId.replace(cwd, '')
		return [cacheDir, normalizedEntryModuleId, fileName].join('/')
	}

	return {
		write: (entryModuleId, item, cachedItem) => {
			const artifactsPath = getArtifactsPath(entryModuleId, cachedItem)
			fs.writeFileSync(
				artifactsPath,
				typeof item === 'string' ? item : JSON.stringify(item),
			)
		},
		read: (entryModuleId, cachedItem) => {
			const artifactsPath = getArtifactsPath(entryModuleId, cachedItem)
			if (!fs.existsSync(artifactsPath)) {
				throw new Error(
					`Cache miss for ${entryModuleId}. Try calling isCached first`,
				)
			}
			const content = fs.readFileSync(artifactsPath, 'utf8')
			if (cachedItem === 'dts' || cachedItem === 'mjs') {
				return content
			}
			try {
				return JSON.parse(content)
			} catch (e) {
				throw new Error(
					`Cache miss for ${entryModuleId} because it isn't valid json. Try calling isCached first`,
				)
			}
		},
		isCached: (entryModuleId, sources, itemType) => {
			// Always check artifacts are cached first
			const artifactsPath = getArtifactsPath(entryModuleId, 'artifactsJson')
			if (!fs.existsSync(artifactsPath)) {
				return false
			}
			/**
			 * @type {import('@tevm/solc').SolcOutput}
			 */
			const previousCachedItem = JSON.parse(
				fs.readFileSync(artifactsPath, 'utf8').toString(),
			)
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
			if (itemType === 'dts' || itemType === 'mjs') {
				return fs.existsSync(getArtifactsPath(entryModuleId, itemType))
			}
			return true
		},
	}
}
