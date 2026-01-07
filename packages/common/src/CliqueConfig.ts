/**
 * Configuration for Clique proof-of-authority consensus.
 * @example
 * ```typescript
 * import type { CliqueConfig } from '@tevm/common'
 *
 * const config: CliqueConfig = {
 *   period: 15, // block interval in seconds
 *   epoch: 30000, // reset votes and snapshots every N blocks
 * }
 * ```
 */
export type CliqueConfig = {
	/**
	 * The block interval in seconds for Clique consensus.
	 * Determines how frequently new blocks are produced.
	 */
	period: number
	/**
	 * Number of blocks after which to reset all votes and
	 * checkpoint snapshots.
	 */
	epoch: number
}
