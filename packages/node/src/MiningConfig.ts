/**
 * Mining configuration that creates blocks at fixed time intervals.
 * @example
 * ```typescript
 * import { IntervalMining } from '@tevm/node'
 *
 * const value: IntervalMining = {
 *   type: 'interval',
 *   interval: 5000 // Mine blocks every 5 seconds
 * }
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
 * Useful for simulating realistic block filling behavior.
 * @example
 * ```typescript
 * import { GasMining } from '@tevm/node'
 *
 * const value: GasMining = {
 *   type: 'gas',
 *   limit: 15000000n // Mine when gas used exceeds 15M
 * }
 * ```
 */
export type GasMining = {
	type: 'gas'
	limit: BigInt
}
/**
 * Configuration options for controlling block mining behavior.
 * Union of all mining strategy types.
 * @example
 * ```typescript
 * import { MiningConfig } from '@tevm/node'
 * import { createMemoryClient } from 'tevm'
 *
 * // Choose one of the mining strategies
 * const miningConfig: MiningConfig = {
 *   type: 'interval',
 *   interval: 2000 // Mine every 2 seconds
 * }
 *
 * const client = createMemoryClient({
 *   mining: miningConfig
 * })
 * ```
 */
export type MiningConfig = IntervalMining | ManualMining | AutoMining | GasMining
