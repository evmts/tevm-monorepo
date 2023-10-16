import { isSolidity } from './isSolidity.js'

const isRelative = (fileName: string) =>
	fileName.startsWith('./') || fileName.startsWith('../')

/**
 * Util to determine if a file path is a solidity file referenced via a relative import
 */
export const isRelativeSolidity = (fileName: string) =>
	isRelative(fileName) && isSolidity(fileName)
