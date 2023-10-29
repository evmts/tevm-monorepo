/**
 * Formats a path to be used in the contract loader
 * @param {string} contractPath - The path to the contract
 * @returns {string} - The formatted path
 * @example
 * ```ts
 * const pathToSolidity = path.join(__dirname, '../Contract.sol')
 * const formattedPath = formatPath(pathToSolidity)
 * console.log(formattedPath) // '/path/to/Contract.sol'
 * ```
 */
export const formatPath = (contractPath) => {
	return contractPath.replace(/\\/g, '/')
}
