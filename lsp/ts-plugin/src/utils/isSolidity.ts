/**
 * Determines if a file path represents a Solidity source file.
 *
 * This utility checks if a path ends with the '.sol' extension while
 * excluding invalid paths like '/.sol' or just '.sol'.
 *
 * @param fileName - The file path or module name to check
 * @returns True if the file appears to be a valid Solidity file, false otherwise
 * @example
 * ```typescript
 * isSolidity('Contract.sol')      // true
 * isSolidity('./path/Contract.sol') // true
 * isSolidity('.sol')              // false
 * isSolidity('/.sol')             // false
 * isSolidity('Contract.js')       // false
 * ```
 */
export const isSolidity = (fileName: string) =>
	fileName.endsWith('.sol') && !fileName.endsWith('/.sol') && fileName !== '.sol'
