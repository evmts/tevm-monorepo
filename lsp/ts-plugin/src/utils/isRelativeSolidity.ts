import { isSolidity } from './isSolidity.js'

/**
 * Helper function to determine if a path is a relative import.
 * Checks if the path starts with './' or '../'.
 *
 * @param fileName - The file path to check
 * @returns True if the path is a relative import, false otherwise
 * @internal
 */
const isRelative = (fileName: string) => fileName.startsWith('./') || fileName.startsWith('../')

/**
 * Determines if a path is both a Solidity file and a relative import.
 *
 * This is used to distinguish between relative Solidity imports
 * (like './Contract.sol') and package imports (like 'package/Contract.sol'),
 * which need different resolution strategies.
 *
 * @param fileName - The file path to check
 * @returns True if the path is both a relative path and a Solidity file, false otherwise
 * @example
 * ```typescript
 * isRelativeSolidity('./Contract.sol')       // true
 * isRelativeSolidity('../Contract.sol')      // true
 * isRelativeSolidity('Contract.sol')         // false (not relative)
 * isRelativeSolidity('./Contract.js')        // false (not Solidity)
 * ```
 */
export const isRelativeSolidity = (fileName: string) => isRelative(fileName) && isSolidity(fileName)
