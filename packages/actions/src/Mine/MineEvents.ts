import type { Block } from '@tevm/block'
import type { TxReceipt } from '@tevm/receipt-manager'
import type { Hex } from '@tevm/utils'

/**
 * Event handlers for mining operations
 * @example
 * ```typescript
 * import { createMemoryClient } from 'tevm'
 * import { mine } from 'tevm/actions'
 *
 * const client = createMemoryClient()
 *
 * const result = await mine(client, {
 *   blockCount: 1,
 *   onBlock: (block, next) => {
 *     console.log(`New block mined: ${block.header.number}`)
 *     next?.()
 *   }
 * })
 * ```
 */
export type MineEvents = {
	/**
	 * Handler called for each new block mined
	 * @param block The newly mined block
	 * @param next Function to continue execution - must be called to proceed
	 */
	onBlock?: (block: Block, next?: () => void) => void

	/**
	 * Handler called for each transaction receipt generated during mining
	 * @param receipt The transaction receipt
	 * @param blockHash The hash of the block containing the receipt
	 * @param next Function to continue execution - must be called to proceed
	 */
	onReceipt?: (receipt: TxReceipt, blockHash: Hex, next?: () => void) => void

	/**
	 * Handler called for each transaction log generated during mining
	 * @param log The transaction log
	 * @param receipt The receipt containing the log
	 * @param next Function to continue execution - must be called to proceed
	 */
	onLog?: (log: TxReceipt['logs'][number], receipt: TxReceipt, next?: () => void) => void
}
