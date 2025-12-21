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
 * Mining configuration that automatically mines blocks at a specified interval.
 * When the interval is 0, blocks are only mined via manual calls to anvil_mine.
 * @example
 * ```typescript
 * import { IntervalMining } from '@tevm/node'
 *
 * const value: IntervalMining = {
 *   type: 'interval',
 *   blockTime: 5 // Mine a block every 5 seconds
 * }
 *
 * // To disable automatic interval mining but allow anvil_mine:
 * const manualValue: IntervalMining = {
 *   type: 'interval',
 *   blockTime: 0
 * }
 * ```
 */
export type IntervalMining = {
	type: 'interval'
	/**
	 * The block time in seconds. When set to 0, blocks are only mined manually via anvil_mine.
	 */
	blockTime: number
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
 *   type: 'auto' // Mine automatically after each transaction
 * }
 *
 * const client = createMemoryClient({
 *   mining: miningConfig
 * })
 * ```
 */
export type MiningConfig = ManualMining | AutoMining | IntervalMining
