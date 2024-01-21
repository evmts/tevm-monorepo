/**
 * Gets the path to the metadata file
 * @param {string} entryModuleId
 * @param {string} cwd
 * @param {string} cacheDir
 * @returns {{dir: string, path: string}}
 */
export const getMetadataPath = (entryModuleId, cwd, cacheDir) => {
	const normalizedEntryModuleId = entryModuleId.replace(cwd, '')
	// TODO these are busted on windows
	const dir = [cwd, cacheDir, normalizedEntryModuleId].join('/')
	const path = [dir, 'metadata.json'].join('/')
	return { dir, path }
}
