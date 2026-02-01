/**
 * @module @tevm/vm-effect
 * @description Effect.ts VmService for type-safe, composable virtual machine operations in TEVM
 *
 * This package provides Effect-based wrappers for @tevm/vm, enabling:
 * - Type-safe dependency injection via Context.Tag
 * - Composable error handling with typed errors
 * - Layer-based configuration for VM setup
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { VmService, VmLive } from '@tevm/vm-effect'
 * import { EvmLive } from '@tevm/evm-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const vmService = yield* VmService
 *   yield* vmService.ready
 *
 *   // Execute a transaction
 *   const result = yield* vmService.runTx({ tx: signedTx })
 *   console.log('Gas used:', result.totalGasSpent)
 *
 *   // Build a block
 *   const blockBuilder = yield* vmService.buildBlock({})
 * })
 *
 * // Build layer stack
 * const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
 * const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
 * const evmLayer = Layer.provide(EvmLive(), Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal))
 * const vmLayer = Layer.provide(VmLive(), Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, CommonLocal))
 *
 * Effect.runPromise(program.pipe(Effect.provide(vmLayer)))
 * ```
 */

// Types
/**
 * @typedef {import('./types.js').VmShape} VmShape
 * @typedef {import('./types.js').VmLiveOptions} VmLiveOptions
 * @typedef {import('./types.js').VmError} VmError
 */

// Service
export { VmService } from './VmService.js'

// Layers
export { VmLive } from './VmLive.js'
