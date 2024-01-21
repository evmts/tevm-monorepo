/**
 * Formats a path to be used in the contract loader
 * @param {string} contractPath - The path to the contract
 * @returns {string} - The formatted path
 */
export const formatPath = (contractPath) => {
	return contractPath.replace(/\\/g, '/')
}
