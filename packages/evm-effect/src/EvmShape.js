/**
 * @module @tevm/evm-effect/EvmShape
 * @description Documentation for the EvmShape interface
 */

/**
 * @typedef {import('./types.js').EvmShape} EvmShape
 */

/**
 * EvmShape Interface
 * ==================
 *
 * The `EvmShape` interface defines the Effect-based API for EVM execution operations.
 * All methods are wrapped in Effect for composable error handling and dependency injection.
 *
 * ## Properties
 *
 * ### evm
 * The underlying `@tevm/evm` EVM instance. Direct access is provided for
 * advanced use cases that need the raw Promise-based API.
 *
 * ### runCall(opts)
 * Execute a call in the EVM. This is the primary method for executing
 * smart contract calls or transferring value.
 *
 * @param opts - EVM run call options including to, from, data, value, gasLimit
 *
 * Returns: `Effect<EVMResult, EvmExecutionError>`
 *
 * ### runCode(opts)
 * Execute raw bytecode in the EVM. Similar to runCall but for
 * direct bytecode execution.
 *
 * @param opts - EVM run code options including code, data, gasLimit
 *
 * Returns: `Effect<EVMResult, EvmExecutionError>`
 *
 * ### getActivePrecompiles()
 * Get all active precompiles registered with the EVM.
 *
 * Returns: `Effect<Map<string, PrecompileInput>>`
 *
 * ### addCustomPrecompile(precompile)
 * Add a custom precompile to the EVM.
 *
 * @param precompile - Custom precompile with address and function
 *
 * Returns: `Effect<void>`
 *
 * ### removeCustomPrecompile(precompile)
 * Remove a custom precompile from the EVM.
 *
 * @param precompile - Custom precompile to remove
 *
 * Returns: `Effect<void>`
 *
 * ## Usage Example
 *
 * ```javascript
 * import { Effect } from 'effect'
 * import { EvmService } from '@tevm/evm-effect'
 * import { EthjsAddress } from '@tevm/utils'
 *
 * const program = Effect.gen(function* () {
 *   const evmService = yield* EvmService
 *
 *   // Execute a simple call
 *   const result = yield* evmService.runCall({
 *     to: EthjsAddress.fromString('0x...'),
 *     data: new Uint8Array([...]),
 *     gasLimit: 1000000n
 *   })
 *
 *   console.log('Gas used:', result.execResult.executionGasUsed)
 *   console.log('Return value:', result.execResult.returnValue)
 *
 *   // Handle execution errors
 *   if (result.execResult.exceptionError) {
 *     console.error('EVM error:', result.execResult.exceptionError)
 *   }
 * })
 * ```
 */

export {}
