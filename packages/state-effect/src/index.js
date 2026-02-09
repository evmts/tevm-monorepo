/**
 * @module @tevm/state-effect
 * @description Effect.ts StateManagerService for type-safe, composable state management in TEVM
 *
 * This package provides Effect-based wrappers for @tevm/state, enabling:
 * - Type-safe dependency injection via Context.Tag
 * - Composable error handling with typed errors
 * - Layer-based configuration for both fork and local mode
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { StateManagerService, StateManagerLocal } from '@tevm/state-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *   yield* stateManager.ready
 *
 *   // Get the state root
 *   const stateRoot = yield* stateManager.getStateRoot()
 *   console.log('State root:', stateRoot)
 *
 *   // Atomic operations with checkpoint
 *   yield* stateManager.checkpoint()
 *   yield* stateManager.putStorage(address, slot, value)
 *   yield* stateManager.commit()
 * })
 *
 * const layer = Layer.provide(StateManagerLocal(), CommonLocal)
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 */

// Types
/**
 * @typedef {import('./types.js').StateManagerShape} StateManagerShape
 * @typedef {import('./types.js').StateManagerLocalOptions} StateManagerLocalOptions
 * @typedef {import('./types.js').StateManagerLiveOptions} StateManagerLiveOptions
 * @typedef {import('./types.js').Hex} Hex
 * @typedef {import('./types.js').Address} Address
 * @typedef {import('./types.js').Bytes32} Bytes32
 */

export { StateManagerLive } from './StateManagerLive.js'

// Layers
export { StateManagerLocal } from './StateManagerLocal.js'
// Service
export { StateManagerService } from './StateManagerService.js'
