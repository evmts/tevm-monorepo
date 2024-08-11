import { bytesToHex } from '@tevm/utils'

/**
 * @internal
 * Emits events after successful mine
 * @param {import("@tevm/node").TevmNode} client
 * @param {Array<import('@tevm/block').Block>} newBlocks]
 * @param {Map<import('@tevm/utils').Hex,Array<import('@tevm/receipt-manager').TxReceipt>>} newReceipts
 */
export const emitEvents = (client, newBlocks, newReceipts) => {
	// emit newBlock events
	newBlocks.forEach((block) => {
		client.emit('newBlock', block)
		const receipts = newReceipts.get(bytesToHex(block.hash()))
		if (!receipts) {
			throw new Error('InternalError: Receipts not found in mineHandler. This indicates a bug in tevm.')
		}
		receipts.forEach((receipt) => {
			client.emit('newReceipt', receipt)
			receipt.logs.forEach((log) => {
				client.emit('newLog', log)
			})
		})
	})
}
