/**
 * @module @tevm/state-effect/StateManagerService
 * @description Effect Context.Tag for StateManager service
 */
/**
 * @typedef {import('./types.js').StateManagerShape} StateManagerShape
 */
/**
 * StateManagerService Context Tag for Effect-based dependency injection.
 *
 * This tag is used to inject the StateManagerShape into Effect computations,
 * enabling type-safe access to state management operations.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { StateManagerService } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *   yield* stateManager.ready
 *
 *   // Get account
 *   const account = yield* stateManager.getAccount('0x...')
 *   console.log('Account balance:', account?.balance)
 *
 *   // Create checkpoint for atomic operations
 *   yield* stateManager.checkpoint()
 *   yield* stateManager.putStorage(address, slot, value)
 *   yield* stateManager.commit()
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Using with layer composition
 * import { Layer, Effect } from 'effect'
 * import { StateManagerService, StateManagerLocal } from '@tevm/state-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const stateManager = yield* StateManagerService
 *   const stateRoot = yield* stateManager.getStateRoot()
 *   console.log('State root:', stateRoot)
 * })
 *
 * const layer = Layer.provide(StateManagerLocal(), CommonLocal)
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 */
export const StateManagerService: Context.Tag<any, any>;
export type StateManagerShape = import("./types.js").StateManagerShape;
import { Context } from 'effect';
//# sourceMappingURL=StateManagerService.d.ts.map