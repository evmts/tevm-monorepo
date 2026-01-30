/**
 * @module @tevm/node-effect
 * @description Effect.ts Node services for type-safe, composable Tevm node state management
 *
 * This package provides Effect-based services for managing Tevm node state, including:
 * - ImpersonationService - Account impersonation state management
 * - BlockParamsService - Block parameter overrides (coming soon)
 * - SnapshotService - EVM state snapshots (coming soon)
 *
 * All services use Effect Refs for type-safe, composable state management.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { ImpersonationService, ImpersonationLive } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   yield* impersonation.setImpersonatedAccount('0x1234567890123456789012345678901234567890')
 *   const account = yield* impersonation.getImpersonatedAccount
 *   console.log('Impersonating:', account)
 * })
 *
 * const layer = ImpersonationLive()
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 */

// Types
/**
 * @typedef {import('./types.js').Address} Address
 * @typedef {import('./types.js').Hex} Hex
 * @typedef {import('./types.js').ImpersonationShape} ImpersonationShape
 * @typedef {import('./types.js').ImpersonationLiveOptions} ImpersonationLiveOptions
 * @typedef {import('./types.js').BlockParamsShape} BlockParamsShape
 * @typedef {import('./types.js').BlockParamsLiveOptions} BlockParamsLiveOptions
 * @typedef {import('./types.js').Snapshot} Snapshot
 * @typedef {import('./types.js').SnapshotShape} SnapshotShape
 */

// Impersonation Service
export { ImpersonationService } from './ImpersonationService.js'
export { ImpersonationLive } from './ImpersonationLive.js'

// Block Params Service (to be implemented)
export { BlockParamsService } from './BlockParamsService.js'
export { BlockParamsLive } from './BlockParamsLive.js'

// Snapshot Service (to be implemented)
export { SnapshotService } from './SnapshotService.js'
export { SnapshotLive } from './SnapshotLive.js'
