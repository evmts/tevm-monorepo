/**
 * @module @tevm/node-effect
 * @description Effect.ts Node services for type-safe, composable Tevm node state management
 *
 * This package provides Effect-based services for managing Tevm node state, including:
 * - ImpersonationService - Account impersonation state management
 * - BlockParamsService - Block parameter overrides
 * - SnapshotService - EVM state snapshots
 * - FilterService - Blockchain event filter management
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
 * @typedef {import('./types.js').Filter} Filter
 * @typedef {import('./types.js').FilterType} FilterType
 * @typedef {import('./types.js').FilterLog} FilterLog
 * @typedef {import('./types.js').LogFilterParams} LogFilterParams
 * @typedef {import('./types.js').FilterShape} FilterShape
 */

export { BlockParamsLive } from './BlockParamsLive.js'
// Block Params Service
export { BlockParamsService } from './BlockParamsService.js'
export { FilterLive } from './FilterLive.js'
// Filter Service
export { FilterService } from './FilterService.js'
export { ImpersonationLive } from './ImpersonationLive.js'
// Impersonation Service
export { ImpersonationService } from './ImpersonationService.js'
export { SnapshotLive } from './SnapshotLive.js'
// Snapshot Service
export { SnapshotService } from './SnapshotService.js'
