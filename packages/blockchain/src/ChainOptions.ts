import type { Block } from '@tevm/block'
import type { Common } from '@tevm/common'
import { type LogOptions } from '@tevm/logger'
import type { BlockTag, EIP1193RequestFn } from '@tevm/utils'

/**
 * Options passed into `createChain` to initialize a Chain object
 */
export type ChainOptions = {
	/**
	 * Logging level of blockchain package. Defaults to `warn`
	 */
	loggingLevel?: LogOptions['level']
	/**
	 * A Common instance
	 */
	common: Common
	/**
	 * Override the genesis block. If fork is provided it will be fetched from fork. Otherwise a default genesis is provided.
	 */
	genesisBlock?: Block
	genesisStateRoot?: Uint8Array
	/**
	 * Optional fork config for forking a live chain
	 */
	fork?: {
		/**
		 * EIP-1193 request function to fetch forked blocks with
		 */
		transport: { request: EIP1193RequestFn }
		/**
		 * Optional block tag to fork
		 * Defaults to 'latest'
		 */
		blockTag?: BlockTag | bigint | `0x${string}`
	}
}
