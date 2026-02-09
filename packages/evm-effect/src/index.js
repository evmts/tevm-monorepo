/**
 * @module @tevm/evm-effect
 * @description Effect.ts EvmService for type-safe, composable EVM execution in TEVM
 *
 * This package provides Effect-based wrappers for @tevm/evm, enabling:
 * - Type-safe dependency injection via Context.Tag
 * - Composable error handling with typed errors
 * - Layer-based configuration for EVM setup
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { EvmService, EvmLive } from '@tevm/evm-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const evmService = yield* EvmService
 *
 *   // Execute a call
 *   const result = yield* evmService.runCall({
 *     to: address,
 *     data: calldata,
 *     gasLimit: 1000000n
 *   })
 *   console.log('Gas used:', result.execResult.executionGasUsed)
 *
 *   // Get precompiles
 *   const precompiles = yield* evmService.getActivePrecompiles()
 *   console.log('Active precompiles:', precompiles.size)
 * })
 *
 * // Build layer stack
 * const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
 * const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
 * const evmLayer = Layer.provide(
 *   EvmLive(),
 *   Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(evmLayer)))
 * ```
 */

// Types
/**
 * @typedef {import('./types.js').EvmShape} EvmShape
 * @typedef {import('./types.js').EvmLiveOptions} EvmLiveOptions
 * @typedef {import('./types.js').EvmError} EvmError
 */

// Layers
export { EvmLive } from './EvmLive.js'
// Service
export { EvmService } from './EvmService.js'

// Utilities
export { mapEvmError } from './mapEvmError.js'
