/**
 * @module @tevm/runtime
 *
 * A module that provides code generation functionality for Tevm. This package
 * is responsible for transforming compiled Solidity artifacts into JavaScript
 * and TypeScript modules with typed Tevm Contract objects.
 *
 * The runtime package generates different types of output formats:
 * - TypeScript declaration files (.d.ts)
 * - TypeScript source files (.ts)
 * - CommonJS modules (.cjs)
 * - ES modules (.mjs)
 *
 * This package is used internally by the Tevm bundler system and is not typically
 * used directly by users.
 *
 * @example
 * ```javascript
 * import { generateRuntime } from '@tevm/runtime'
 * import { runPromise } from 'effect/Effect'
 *
 * // Example artifacts from Solidity compilation
 * const artifacts = {
 *   "Counter": {
 *     "abi": [
 *       {
 *         "inputs": [],
 *         "name": "count",
 *         "outputs": [{"type": "uint256"}],
 *         "stateMutability": "view",
 *         "type": "function"
 *       },
 *       // ... more ABI entries
 *     ],
 *     "evm": {
 *       "bytecode": { "object": "608060..." },
 *       "deployedBytecode": { "object": "608060..." }
 *     }
 *   }
 * }
 *
 * // Generate TypeScript code
 * const tsCode = await runPromise(
 *   generateRuntime(
 *     artifacts,
 *     'ts',          // Output module type
 *     true,          // Include bytecode
 *     '@tevm/contract' // Package to import from
 *   )
 * )
 *
 * console.log(tsCode)
 * // The generated code will look something like:
 * // import { createContract } from '@tevm/contract'
 * // const _Counter = {
 * //   name: "Counter",
 * //   humanReadableAbi: ["function count() view returns (uint256)"],
 * //   bytecode: "0x608060...",
 * //   deployedBytecode: "0x608060..."
 * // } as const
 * // export const Counter = createContract(_Counter)
 * ```
 *
 * @typedef {import('./types.js').ModuleType} ModuleType
 */
export { generateRuntime } from './generateRuntime.js'
