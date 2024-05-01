import type { Block } from '@tevm/block'
import type { Common } from '@tevm/common'
import type { BlockTag } from 'viem'

/**
 * Options passed into `createChain` to initialize a Chain object
 */
export type ChainOptions = {
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
     * JSON-RPC url to fork
     */
		url: string
    /**
     * Optional block tag to fork
     * Defaults to 'latest'
     */
		blockTag?: BlockTag | bigint | `0x${string}`
	}
}
