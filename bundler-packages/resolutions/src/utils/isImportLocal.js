/**
 * Check if import path is local
 * @param {string} importPath
 * @returns {boolean}
 * @example
 * ```ts
 * const isLocal = isImportLocal('../Contract.sol')
 * console.log(isLocal) // true
 * ```
 */
export const isImportLocal = (importPath) => {
	return importPath.startsWith('.')
}
