/**
 * Creates a Tevm cache object for reading and writing cached items
 * @param {string} cacheDir
 * @param {import('fs')} fs
 * @param {string} cwd
 * @returns {import('./types.js').Cache}
 */
export const createCache = (cacheDir, fs, cwd) => {
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
		writeArtifacts: (entryModuleId, compiledContracts) => {
			const artifactsPath = getArtifactsPath(entryModuleId, 'artifactsJson')
			fs.writeFileSync(
				artifactsPath,
				JSON.stringify(compiledContracts, null, 2),
			)
			return artifactsPath
		},

		readArtifacts: (entryModuleId) => {
			const artifactsPath = getArtifactsPath(entryModuleId, 'artifactsJson')
			if (!fs.existsSync(artifactsPath)) {
				return undefined
			}
			const content = fs.readFileSync(artifactsPath, 'utf8')
			try {
				return JSON.parse(content)
			} catch (e) {
				throw new Error(
					`Cache miss for ${entryModuleId} because it isn't valid json`,
				)
			}
		},

		writeDts: (entryModuleId, dtsFile) => {
			const dtsPath = getArtifactsPath(entryModuleId, 'dts')
			fs.writeFileSync(dtsPath, dtsFile)
			return dtsPath
		},

		readDts: (entryModuleId) => {
			const dtsPath = getArtifactsPath(entryModuleId, 'dts')
			if (!fs.existsSync(dtsPath)) {
				return undefined
			}
			return fs.readFileSync(dtsPath, 'utf8')
		},

		writeMjs: (entryModuleId, mjsFile) => {
			const mjsPath = getArtifactsPath(entryModuleId, 'mjs')
			fs.writeFileSync(mjsPath, mjsFile)
			return mjsPath
		},

		readMjs: (entryModuleId) => {
			const mjsPath = getArtifactsPath(entryModuleId, 'mjs')
			if (!fs.existsSync(mjsPath)) {
				return undefined
			}
			return fs.readFileSync(mjsPath, 'utf8')
		},
	}
}
