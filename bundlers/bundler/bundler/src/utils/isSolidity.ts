/**
 * Util to determine if a file path is a solidity file
 */
export const isSolidity = (fileName: string) =>
	fileName.endsWith('.sol') &&
	!fileName.endsWith('/.sol') &&
	fileName !== '.sol'
