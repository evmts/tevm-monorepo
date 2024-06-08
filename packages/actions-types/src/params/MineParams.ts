import type { BaseParams } from './BaseParams.js'

/**
 * Tevm params to mine 1 or more blocks
 * @example
 * const mineParams: import('@tevm/actions-types').MineParams = {
 *   blockCount: 5,
 * }
 */
export type MineParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
	/**
	 * Number of blocks to mine. Defaults to 1
	 */
	readonly blockCount?: number
	/**
	 * Interval between block timestamps. Defaults to 1
	 */
	readonly interval?: number
}
