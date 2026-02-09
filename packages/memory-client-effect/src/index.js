/**
 * @module @tevm/memory-client-effect
 *
 * Effect.ts-based memory client for TEVM with viem compatibility.
 *
 * This package provides:
 * - **MemoryClientService**: Effect-based service for type-safe TEVM operations
 * - **MemoryClientLive**: Layer implementation composing all TEVM services
 * - **createMemoryClient**: Viem-compatible Promise wrapper with Effect escape hatch
 *
 * ## Effect-Native Usage
 *
 * For Effect users who want full type-safety and composability:
 *
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { MemoryClientService, MemoryClientLive } from '@tevm/memory-client-effect'
 *
 * const program = Effect.gen(function* () {
 *   const client = yield* MemoryClientService
 *
 *   // All operations return Effects
 *   yield* client.ready
 *   const blockNumber = yield* client.getBlockNumber
 *   const balance = yield* client.getBalance({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *
 *   // State management
 *   yield* client.setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 1000000000000000000n
 *   })
 *
 *   // Snapshot/restore for test isolation
 *   const snapshotId = yield* client.takeSnapshot()
 *   // ... operations ...
 *   yield* client.revertToSnapshot(snapshotId)
 *
 *   return { blockNumber, balance }
 * })
 *
 * // Provide required layers and run
 * await Effect.runPromise(program.pipe(
 *   Effect.provide(MemoryClientLive),
 *   Effect.provide(otherRequiredLayers)
 * ))
 * ```
 *
 * ## Viem-Compatible Usage
 *
 * For users who prefer the traditional Promise-based API:
 *
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client-effect'
 *
 * const client = createMemoryClient()
 *
 * // Standard Promise API
 * await client.ready()
 * const blockNumber = await client.getBlockNumber()
 * const balance = await client.getBalance({
 *   address: '0x1234567890123456789012345678901234567890'
 * })
 *
 * // TEVM-specific operations
 * await client.tevmSetAccount({
 *   address: '0x1234567890123456789012345678901234567890',
 *   balance: 1000000000000000000n
 * })
 *
 * // Escape hatch to Effect for advanced use cases
 * const result = await client.effect.runtime.runPromise(
 *   Effect.gen(function* () {
 *     const memClient = yield* MemoryClientService
 *     return yield* memClient.getBlockNumber
 *   })
 * )
 *
 * // Clean up when done
 * await client.destroy()
 * ```
 *
 * ## Layer Composition
 *
 * The memory client composes multiple Effect services:
 *
 * ```
 * MemoryClientService
 *  ├── StateManagerService (account state)
 *  ├── VmService (EVM execution)
 *  ├── CommonService (chain config)
 *  ├── GetAccountService
 *  ├── SetAccountService
 *  ├── GetBalanceService
 *  ├── GetCodeService
 *  ├── GetStorageAtService
 *  └── SnapshotService
 * ```
 *
 * @packageDocumentation
 */

// Viem-compatible wrapper
export { createMemoryClient } from './createMemoryClient.js'

// Layer implementation
export { MemoryClientLive } from './MemoryClientLive.js'
// Service definition
export { MemoryClientService } from './MemoryClientService.js'

// Re-export types
export * from './types.js'
