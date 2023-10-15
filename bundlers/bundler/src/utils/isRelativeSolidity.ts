import { isSolidity } from './isSolidity.js'

/**
 * Util to determine if a file path is a solidity file referenced via a relative import
 */
export const isRelativeSolidity = (fileName: string) =>
	fileName.startsWith('./') && isSolidity(fileName)
