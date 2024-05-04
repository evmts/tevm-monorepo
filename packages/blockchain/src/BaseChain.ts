import type { Block } from '@tevm/block'
import type { Common } from '@tevm/common'
import type { BlockTag, Hex } from '@tevm/utils'
import type { ChainOptions } from './ChainOptions.js'

/**
 * Internal implementation of blockchain used to implement the public interface
 */
export type BaseChain = {
	/**
	 * Options passed into factory function
	 */
	options: ChainOptions
	common: Common
	/**
	 * Mapping of block hashes to blocks
	 */
	blocks: Map<Hex, Block | undefined>
	/**
	 * Mapping of named block tags such as 'latest' to blocks
	 */
	blocksByTag: Map<BlockTag, Block | undefined>
	/**
	 * Mapping of block numbers to blocks
	 */
	blocksByNumber: Map<bigint, Block | undefined>
	/**
	 * Returns a promise that resolves when the chain is ready
	 */
	ready: () => Promise<true>
}
