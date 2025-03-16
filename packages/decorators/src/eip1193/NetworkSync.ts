// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
// import type { Address } from 'abitype'
import type { Hex } from '@tevm/utils'

/**
 * Hexadecimal string representation of an Ethereum quantity (number).
 * Used throughout the Ethereum JSON-RPC API for numerical values.
 * @example
 * ```typescript
 * import { Quantity } from '@tevm/decorators'
 *
 * const blockNumber: Quantity = '0x4b7' // 1207 in decimal
 * const gasPrice: Quantity = '0x3b9aca00' // 1,000,000,000 in decimal (1 Gwei)
 * ```
 */
export type Quantity = Hex

/**
 * Information about the Ethereum client's sync status.
 * Returned by the eth_syncing JSON-RPC method when synchronization is in progress.
 * @example
 * ```typescript
 * import { NetworkSync } from '@tevm/decorators'
 * import { createTevmNode } from 'tevm'
 * import { requestEip1193 } from '@tevm/decorators'
 *
 * const node = createTevmNode().extend(requestEip1193())
 * const syncStatus = await node.request({ method: 'eth_syncing' })
 *
 * if (syncStatus !== false) {
 *   const networkSync: NetworkSync = syncStatus
 *   console.log(`Syncing: ${networkSync.currentBlock} of ${networkSync.highestBlock}`)
 *   console.log(`Progress: ${(parseInt(networkSync.currentBlock, 16) / parseInt(networkSync.highestBlock, 16) * 100).toFixed(2)}%`)
 * } else {
 *   console.log('Node is fully synced')
 * }
 * ```
 */
export type NetworkSync = {
	/** The current block number */
	currentBlock: Quantity
	/** Number of latest block on the network */
	highestBlock: Quantity
	/** Block number at which syncing started */
	startingBlock: Quantity
}
