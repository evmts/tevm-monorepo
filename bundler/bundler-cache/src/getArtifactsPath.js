/**
 * Returns the path to the cached artifacts file for a given entry module id.
 * @param {string} entryModuleId
 * @param {import('./types.js').CachedItem} item
 * @param {string} cwd
 * @param {string} cacheDir
 * @returns {string}
 */
export const getArtifactsPath = (entryModuleId, item, cwd, cacheDir) => {
  const fileName = {
    dts: 'contract.d.ts',
    artifactsJson: 'artifacts.json',
    mjs: 'contract.mjs',
  }[item]
  const normalizedEntryModuleId = entryModuleId.replace(cwd, '')
  return [cacheDir, normalizedEntryModuleId, fileName].join('/')
}

