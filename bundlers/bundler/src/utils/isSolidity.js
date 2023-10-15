/**
 * Util to determine if a file path is a solidity file
 * @param {string} fileName - The file name to check
 * @returns {boolean} - Whether or not the file is a solidity file
 */
export const isSolidity = (fileName) =>
	fileName.endsWith('.sol') &&
	!fileName.endsWith('/.sol') &&
	fileName !== '.sol'
