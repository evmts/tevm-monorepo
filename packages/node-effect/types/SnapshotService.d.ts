/**
 * @module @tevm/node-effect/SnapshotService
 * @description Effect Context.Tag for Snapshot service
 */
/**
 * @typedef {import('./types.js').SnapshotShape} SnapshotShape
 */
/**
 * SnapshotService Context Tag for Effect-based dependency injection.
 *
 * This tag is used to inject the SnapshotShape into Effect computations,
 * enabling type-safe access to EVM state snapshot operations.
 *
 * Snapshots allow saving and restoring EVM state, useful for:
 * - Testing smart contracts with state isolation
 * - Simulating transactions without permanent state changes
 * - Implementing evm_snapshot/evm_revert JSON-RPC methods
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { SnapshotService } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const snapshot = yield* SnapshotService
 *   const id = yield* snapshot.takeSnapshot()
 *   console.log('Snapshot ID:', id)
 *   // Do some operations...
 *   yield* snapshot.revertToSnapshot(id)
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Using with layer composition
 * import { Effect, Layer } from 'effect'
 * import { SnapshotService, SnapshotLive } from '@tevm/node-effect'
 * import { StateManagerService, StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const snapshot = yield* SnapshotService
 *   const id = yield* snapshot.takeSnapshot()
 *   // Modify state...
 *   yield* snapshot.revertToSnapshot(id)
 *   console.log('State reverted')
 * })
 *
 * const layer = Layer.provide(SnapshotLive(), StateManagerLocal())
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 */
export const SnapshotService: Context.Tag<any, any>;
export type SnapshotShape = import("./types.js").SnapshotShape;
import { Context } from 'effect';
//# sourceMappingURL=SnapshotService.d.ts.map