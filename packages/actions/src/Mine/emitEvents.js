import { bytesToHex } from '@tevm/utils'

/**
 * Helper function to call an event handler with a next callback
 * @template T
 * @template A
 * @param {((data: T, secondParam?: A, next?: () => void) => void | Promise<void>) | undefined} handler - Event handler to call
 * @param {T} data - Data to pass to the handler
 * @param {A | undefined} [secondParam] - Optional second parameter
 * @returns {Promise<void>}
 */
const callHandler = async (handler, data, secondParam) => {
	if (typeof handler === 'function') {
		let hasCalledNext = false
		const next = () => {
			hasCalledNext = true
		}

		try {
			let result
			if (secondParam !== undefined) {
				result = handler(data, secondParam, next)
			} else {
				// @ts-expect-error - We know handler is callable with just data and next
				result = handler(data, next)
			}

			// Check if the handler returned a promise
			if (result instanceof Promise) {
				await result
			}

			// If the handler doesn't call next, we consider it synchronous
			if (!hasCalledNext) {
				// Handler completed without calling next, which is fine
			}
		} catch (error) {
			console.error('Error in event handler:', error)
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
 * @returns {Promise<void>}
 */
export const emitEvents = async (client, newBlocks, newReceipts, params = {}) => {
	// extract event handlers
	const { onBlock, onReceipt, onLog } = params

	// emit newBlock events
	for (const block of newBlocks) {
		// Emit global events
		client.emit('newBlock', block)

		// Call handler if provided
		await callHandler(onBlock, block)

		const blockHash = bytesToHex(block.hash())
		await client.emitExExEvent({ type: 'block', phase: 'imported', block, blockHash })
		const receipts = newReceipts.get(blockHash)
		if (!receipts) {
			throw new Error(
				`InternalError: Receipts not found for block hash ${blockHash} in mineHandler. This indicates a bug in tevm.`,
			)
		}

		let cumulativeLogIndex = 0n
		for (let txIndex = 0; txIndex < receipts.length; txIndex++) {
			const receipt = receipts[txIndex]
			if (!receipt) {
				continue
			}
			// Emit global events
			client.emit('newReceipt', receipt)

			// Call handler if provided
			// @ts-expect-error - Handler types are defined in MineEvents.ts
			await callHandler(onReceipt, receipt, blockHash)
			await client.emitExExEvent({ type: 'receipt', phase: 'created', blockHash, receipt })
			const txHash = /** @type {any} */ (receipt).txHash
			await client.emitExExEvent({
				type: 'transaction',
				phase: 'executed',
				txHash: txHash ? bytesToHex(txHash) : '0x',
				blockHash,
				receipt,
			})

			const tx = block.transactions?.[txIndex]
			const transactionHash = tx ? bytesToHex(tx.hash()) : txHash ? bytesToHex(txHash) : '0x'
			for (const log of receipt.logs) {
				// Emit global events
				client.emit('newLog', log, {
					blockHash,
					blockNumber: block.header.number,
					transactionHash,
					transactionIndex: BigInt(txIndex),
					logIndex: cumulativeLogIndex,
				})
				cumulativeLogIndex++

				// Call handler if provided
				// @ts-expect-error - Handler types are defined in MineEvents.ts
				await callHandler(onLog, log, receipt)
				await client.emitExExEvent({ type: 'log', phase: 'created', blockHash, receipt, log })
			}
		}
		await client.emitExExEvent({
			type: 'state',
			phase: 'committed',
			blockHash,
			stateRoot: bytesToHex(block.header.stateRoot),
		})
		await client.emitExExEvent({
			type: 'canonical',
			phase: 'headChanged',
			headHash: blockHash,
			headNumber: block.header.number,
			reorged: false,
		})
	}
}
