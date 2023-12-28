/**
 * Returns the path to the cached artifacts file for a given entry module id.
 * @param {string} entryModuleId
 * @param {import('./types.js').CachedItem} item
 * @param {string} cwd
 * @param {string} cacheDir
 * @returns {{dir: string, path: string}}
 */
export const getArtifactsPath = (entryModuleId, item, cwd, cacheDir) => {
	const fileName = {
		dts: 'contract.d.ts',
		artifactsJson: 'artifacts.json',
		mjs: 'contract.mjs',
	}[item]
	let normalizedEntryModuleId = entryModuleId.replace(cwd, '')
	if (normalizedEntryModuleId.startsWith('/')) {
		normalizedEntryModuleId = normalizedEntryModuleId.slice(1)
	}
	// TODO both of these are busted on windows
	const dir = [cwd, cacheDir, normalizedEntryModuleId].join('/')
	const path = [dir, fileName].join('/')
	return { dir, path }
}
