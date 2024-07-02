import type { BlockOptions } from '@tevm/block'

/**
 * Options for the block builder.
 */
export interface BuilderOpts extends BlockOptions {
	/**
	 * Whether to put the block into the vm's blockchain after building it.
	 * This is useful for completing a full cycle when building a block so
	 * the only next step is to build again, however it may not be desired
	 * if the block is being emulated or may be discarded as to not affect
	 * the underlying blockchain.
	 *
	 * Default: true
	 */
	putBlockIntoBlockchain?: boolean
}
