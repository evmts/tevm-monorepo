/**
 * Gets the path to the metadata file
 * @param {string} entryModuleId
 * @param {string} cwd
 * @param {string} cacheDir
 * @returns {string}
 */
export const getMetadataPath = (entryModuleId, cwd, cacheDir) => {
  const normalizedEntryModuleId = entryModuleId.replace(cwd, '')
  return [cacheDir, normalizedEntryModuleId, 'metadata.json'].join('/')
}
