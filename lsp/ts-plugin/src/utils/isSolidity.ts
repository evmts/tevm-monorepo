/**
 * Determines if a file path represents a Solidity source file.
 *
 * This utility checks if a path ends with the '.sol' extension while
 * excluding invalid paths like '/.sol' or just '.sol'.
 * Also supports inline Solidity temp files that end with '.js.sol' or '.ts.sol'.
 *
 * @param fileName - The file path or module name to check
 * @returns True if the file appears to be a valid Solidity file, false otherwise
 * @example
 * ```typescript
 * isSolidity('Contract.sol')          // true
 * isSolidity('./path/Contract.sol')   // true
 * isSolidity('app_0.js.sol')          // true (inline solidity)
 * isSolidity('component_1.ts.sol')    // true (inline solidity)
 * isSolidity('.sol')                  // false
 * isSolidity('/.sol')                 // false
 * isSolidity('Contract.js')           // false
 * ```
 */
export const isSolidity = (fileName: string) =>
	(fileName.endsWith('.sol') || fileName.endsWith('.js.sol') || fileName.endsWith('.ts.sol')) &&
	!fileName.endsWith('/.sol') &&
	fileName !== '.sol'
