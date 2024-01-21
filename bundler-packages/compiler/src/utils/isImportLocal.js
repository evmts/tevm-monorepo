/**
 * Check if import path is local
 * @param {string} importPath
 * @returns {boolean}
 */
export const isImportLocal = (importPath) => {
	return importPath.startsWith('.')
}
