// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
// import type { Address } from 'abitype'
import type { Hex } from '@tevm/utils'

export type Quantity = Hex

export type NetworkSync = {
	/** The current block number */
	currentBlock: Quantity
	/** Number of latest block on the network */
	highestBlock: Quantity
	/** Block number at which syncing started */
	startingBlock: Quantity
}
