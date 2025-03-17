import type { BaseParams } from '../common/BaseParams.js'
import type { MineEvents } from './MineEvents.js'

/**
 * Tevm params to mine one or more blocks.
 * @example
 * ```typescript
 * const mineParams: import('@tevm/actions').MineParams = {
 *   blockCount: 5,
 *   onBlock: (block, next) => {
 *     console.log(`Block mined: ${block.header.number}`)
 *     next()
 *   }
 * }
 * ```
 * @param {number} [blockCount=1] - Number of blocks to mine. Defaults to 1.
 * @param {number} [blocks=1] - Alias for blockCount. Number of blocks to mine. Defaults to 1.
 * @param {number} [interval=1] - Interval between block timestamps in seconds. Defaults to 1.
 * @extends {BaseParams}
 * @extends {MineEvents}
 */
export type MineParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> &
	MineEvents & {
		/**
		 * Number of blocks to mine. Defaults to 1.
		 */
		readonly blockCount?: number
		/**
		 * Alias for blockCount. Number of blocks to mine. Defaults to 1.
		 */
		readonly blocks?: number
		/**
		 * Interval between block timestamps. Defaults to 1.
		 */
		readonly interval?: number
	}
