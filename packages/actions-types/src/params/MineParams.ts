/**
 * Tevm params to mine 1 or more blocks
 * @example
 * const mineParams: import('@tevm/actions-types').MineParams = {
 *   blockCount: 5,
 * }
 */
export type MineParams = {
	/**
	 * Number of blocks to mine. Defaults to 1
	 */
	blockCount?: number
	/**
	 * Interval between block timestamps. Defaults to 1
	 */
	interval?: number
}
