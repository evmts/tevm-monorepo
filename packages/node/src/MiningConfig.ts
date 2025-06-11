/**
 * Mining configuration that creates blocks at fixed time intervals.
 * @deprecated This mining mode is not yet implemented. Use 'manual' or 'auto' instead.
 * @internal This type is deprecated and will be removed in a future version.
 * @example
 * ```typescript
 * // This is not yet implemented - use manual or auto mining instead
 * import { ManualMining, AutoMining } from '@tevm/node'
 *
 * const manualMining: ManualMining = { type: 'manual' }
 * const autoMining: AutoMining = { type: 'auto' }
 * ```
 */
export type IntervalMining = {
	type: 'interval'
	interval: number
}
/**
 * Mining configuration where blocks are only created when explicitly requested.
 * Transactions remain in the mempool until manually mined.
 * @example
 * ```typescript
 * import { ManualMining } from '@tevm/node'
 *
 * const value: ManualMining = {
 *   type: 'manual'
 * }
 *
 * // Later blocks can be mined manually:
 * // await client.mine({ blocks: 1 })
 * ```
 */
export type ManualMining = {
	type: 'manual'
}
/**
 * Mining configuration that automatically mines blocks for every transaction.
 * Each transaction is immediately included in its own block.
 * @example
 * ```typescript
 * import { AutoMining } from '@tevm/node'
 *
 * const value: AutoMining = {
 *   type: 'auto'
 * }
 * ```
 */
export type AutoMining = {
	type: 'auto'
}
/**
 * Mining configuration that mines blocks when accumulated gas usage exceeds a threshold.
 * @deprecated This mining mode is not yet fully implemented. Use 'manual' or 'auto' instead.
 * @internal This type is deprecated and will be removed in a future version.
 * @example
 * ```typescript
 * // This is not yet fully implemented - use manual or auto mining instead
 * import { ManualMining, AutoMining } from '@tevm/node'
 *
 * const manualMining: ManualMining = { type: 'manual' }
 * const autoMining: AutoMining = { type: 'auto' }
 * ```
 */
export type GasMining = {
	type: 'gas'
	limit: BigInt
}
/**
 * Configuration options for controlling block mining behavior.
 * Currently supports manual and auto mining modes.
 * 
 * @example
 * ```typescript
 * import { MiningConfig } from '@tevm/node'
 * import { createMemoryClient } from 'tevm'
 *
 * // Manual mining (default) - mine only when explicitly requested
 * const manualConfig: MiningConfig = { type: 'manual' }
 *
 * // Auto mining - mine immediately after each transaction
 * const autoConfig: MiningConfig = { type: 'auto' }
 *
 * const client = createMemoryClient({
 *   mining: manualConfig
 * })
 * ```
 */
export type MiningConfig = ManualMining | AutoMining | IntervalMining | GasMining
