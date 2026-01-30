import { Context } from 'effect'

/**
 * @module @tevm/node-effect/FilterService
 * @description Effect Context.Tag for FilterService providing filter management
 */

/**
 * @typedef {import('./types.js').FilterShape} FilterShape
 */

/**
 * FilterService Context.Tag for Effect-based filter management.
 *
 * FilterService provides type-safe, composable filter management for tracking
 * blockchain events like new blocks, pending transactions, and logs.
 *
 * Filters are used by eth_newFilter, eth_newBlockFilter, eth_newPendingTransactionFilter,
 * eth_getFilterChanges, eth_getFilterLogs, and eth_uninstallFilter JSON-RPC methods.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { FilterService, FilterLive } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const filter = yield* FilterService
 *
 *   // Create a new log filter
 *   const filterId = yield* filter.createLogFilter({
 *     address: '0x1234567890123456789012345678901234567890',
 *     topics: [['0xabc...']],
 *   })
 *
 *   // Get filter changes
 *   const changes = yield* filter.getChanges(filterId)
 *   console.log('Filter changes:', changes)
 *
 *   // Remove filter when done
 *   yield* filter.remove(filterId)
 * })
 * ```
 *
 * @type {Context.Tag<FilterService, FilterShape>}
 */
export const FilterService = Context.GenericTag('FilterService')
