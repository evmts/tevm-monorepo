import type { BaseParams } from '../common/BaseParams.js'
import type { BlockTag } from '../common/BlockTag.js'
import type { Hex } from '../common/Hex.js'

export type DumpStateParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
	/**
	 * Block tag to fetch account from
	 * - bigint for block number
	 * - hex string for block hash
	 * - 'latest', 'earliest', 'pending', 'forked' etc. tags
	 */
	readonly blockTag?: BlockTag | bigint | Hex
}
