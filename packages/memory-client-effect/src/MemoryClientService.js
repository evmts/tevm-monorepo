/**
 * @module @tevm/memory-client-effect/MemoryClientService
 * Service definition for the Effect-based memory client
 */

import { Context } from 'effect'

/**
 * MemoryClientService provides a type-safe, Effect-based interface for TEVM operations.
 *
 * This service composes all underlying TEVM services (StateManager, VM, Blockchain, etc.)
 * into a unified client interface. It provides:
 * - Account state queries and mutations
 * - Block and transaction operations
 * - Snapshot/restore functionality
 * - Deep copy for state isolation
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { MemoryClientService, MemoryClientLive } from '@tevm/memory-client-effect'
 *
 * const program = Effect.gen(function* () {
 *   const client = yield* MemoryClientService
 *
 *   // Wait for client to be ready
 *   yield* client.ready
 *
 *   // Get account balance
 *   const balance = yield* client.getBalance({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *
 *   // Set account state
 *   yield* client.setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 1000000000000000000n
 *   })
 *
 *   // Take snapshot for later restoration
 *   const snapshotId = yield* client.takeSnapshot()
 *
 *   return { balance, snapshotId }
 * })
 *
 * // Provide the live implementation
 * const result = await Effect.runPromise(
 *   program.pipe(Effect.provide(MemoryClientLive()))
 * )
 * ```
 *
 * @type {Context.Tag<MemoryClientService, import('./types.js').MemoryClientShape>}
 */
export const MemoryClientService = /** @type {Context.Tag<MemoryClientService, import('./types.js').MemoryClientShape>} */ (
	Context.GenericTag('@tevm/memory-client-effect/MemoryClientService')
)
