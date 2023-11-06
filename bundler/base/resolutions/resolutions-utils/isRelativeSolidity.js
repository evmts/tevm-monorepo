import { isSolidity } from './isSolidity.js'

/**
 * Util to determine if a file path is a solidity file referenced via a relative import
 * @param {string} fileName - The file path to check
 * @returns {boolean} True if the file path is a solidity file referenced via a relative import
 * @example
 * ```ts
 * const isRelativeSolidity = isRelativeSolidity('./Contract.sol')
 * console.log(isRelativeSolidity) // true
 * ```
 */
export const isRelativeSolidity = (fileName) =>
	fileName.startsWith('./') && isSolidity(fileName)
