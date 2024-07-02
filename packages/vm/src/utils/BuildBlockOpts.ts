import type { Block, HeaderData } from '@tevm/block'
import type { WithdrawalData } from '@tevm/utils'
import type { BuilderOpts } from './BuilderOpts.js'

/**
 * Options for building a block.
 */
export interface BuildBlockOpts {
	/**
	 * The parent block
	 */
	parentBlock: Block

	/**
	 * The block header data to use.
	 * Defaults used for any values not provided.
	 */
	headerData?: HeaderData

	withdrawals?: WithdrawalData[]
	/**
	 * The block and builder options to use.
	 */
	blockOpts?: BuilderOpts
}
