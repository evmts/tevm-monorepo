import { bytesToHex } from '@tevm/utils'

/**
 * Helper function to call an event handler with a next callback
 * @template T, A, B
 * @param {((data: T, secondParam?: A, next?: () => void) => void) | undefined} handler - Event handler to call
 * @param {T} data - Data to pass to the handler
 * @param {A} [secondParam] - Optional second parameter
 * @param {B} [thirdParam] - Optional third parameter
 * @returns {void}
 */
const callHandler = (handler, data, secondParam, thirdParam) => {
	if (typeof handler === 'function') {
		let hasCalledNext = false
		const next = () => {
			hasCalledNext = true
		}

		if (secondParam !== undefined && thirdParam !== undefined) {
			// @ts-ignore - Dynamic function call with variable arguments
			handler(data, secondParam, thirdParam, next)
		} else if (secondParam !== undefined) {
			// @ts-ignore - Dynamic function call with variable arguments
			handler(data, secondParam, next)
		} else {
			handler(data, next)
		}

		// If the handler doesn't call next, we consider it synchronous
		if (!hasCalledNext) {
			// Handler completed without calling next, which is fine
		}
	}
}

/**
 * @internal
 * Emits events after successful mine
 * @param {import("@tevm/node").TevmNode} client
 * @param {Array<import('@tevm/block').Block>} newBlocks
 * @param {Map<import('@tevm/utils').Hex,Array<import('@tevm/receipt-manager').TxReceipt>>} newReceipts
 * @param {import('./MineParams.js').MineParams} [params]
 */
export const emitEvents = (client, newBlocks, newReceipts, params = {}) => {
	// extract event handlers
	const { onBlock, onReceipt, onLog } = params

	// emit newBlock events
	newBlocks.forEach((block) => {
		// Emit global events
		client.emit('newBlock', block)

		// Call handler if provided
		callHandler(onBlock, block)

		const blockHash = bytesToHex(block.hash())
		const receipts = newReceipts.get(blockHash)
		if (!receipts) {
			throw new Error('InternalError: Receipts not found in mineHandler. This indicates a bug in tevm.')
		}

		receipts.forEach((receipt) => {
			// Emit global events
			client.emit('newReceipt', receipt)

			// Call handler if provided
			callHandler(onReceipt, receipt, blockHash)

			receipt.logs.forEach((log) => {
				// Emit global events
				client.emit('newLog', log)

				// Call handler if provided
				callHandler(onLog, log, receipt)
			})
		})
	})
}
