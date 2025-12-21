import { InternalError, MisconfiguredClientError, UnreachableCodeError } from '@tevm/errors'
import { bytesToHex, hexToBytes, numberToHex } from '@tevm/utils'

/**
 * Request handler for anvil_mineDetailed JSON-RPC requests.
 * Mines blocks and returns detailed execution results including transaction traces.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilMineDetailedProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilMineDetailedJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const procedure = anvilMineDetailedJsonRpcProcedure(node)
 *
 * // Mine a block with detailed results
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_mineDetailed',
 *   params: ['0x1', '0x1'],
 *   id: 1
 * })
 * console.log(result.result.blocks) // Detailed block information
 * ```
 */
export const anvilMineDetailedJsonRpcProcedure = (client) => {
	return async (request) => {
		const [blockCountHex = '0x1', intervalHex = '0x1'] = request.params ?? []
		const blockCount = Number(BigInt(blockCountHex))
		const interval = Number(BigInt(intervalHex))

		// Check client status
		switch (client.status) {
			case 'MINING': {
				return {
					jsonrpc: '2.0',
					method: request.method,
					error: {
						code: -32000,
						message: 'Mining is already in progress',
					},
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
			case 'INITIALIZING': {
				await client.ready()
				client.status = 'MINING'
				break
			}
			case 'SYNCING': {
				return {
					jsonrpc: '2.0',
					method: request.method,
					error: {
						code: -32000,
						message: 'Syncing not currently implemented',
					},
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
			case 'STOPPED': {
				return {
					jsonrpc: '2.0',
					method: request.method,
					error: {
						code: -32000,
						message: 'Client is stopped',
					},
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
			case 'READY': {
				client.status = 'MINING'
				break
			}
			default: {
				return {
					jsonrpc: '2.0',
					method: request.method,
					error: {
						code: -32000,
						message: 'Unexpected client status',
					},
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
		}

		try {
			client.logger.debug({ blockCount, interval }, 'anvilMineDetailedProcedure called with params')

			/**
			 * @type {import('./AnvilResult.js').AnvilMineDetailedResult['blocks']}
			 */
			const blocks = []

			const pool = await client.getTxPool()
			const originalVm = await client.getVm()
			const vm = await originalVm.deepCopy()
			const receiptsManager = await client.getReceiptsManager()

			for (let count = 0; count < blockCount; count++) {
				const parentBlock = await vm.blockchain.getCanonicalHeadBlock()

				// Use nextBlockTimestamp if set (only for the first block), otherwise use current time
				const overrideTimestamp = count === 0 ? client.getNextBlockTimestamp() : undefined
				// Get the automatic interval if set
				const automaticInterval = client.getBlockTimestampInterval()
				let timestamp =
					overrideTimestamp !== undefined
						? Number(overrideTimestamp)
						: Math.max(Math.floor(Date.now() / 1000), Number(parentBlock.header.timestamp))
				// Apply interval (prefer automatic interval over manual interval parameter)
				const intervalToUse = automaticInterval !== undefined ? Number(automaticInterval) : interval
				timestamp = count === 0 ? timestamp : timestamp + intervalToUse
				// Clear the timestamp override after using it
				if (count === 0 && overrideTimestamp !== undefined) {
					client.setNextBlockTimestamp(undefined)
				}

				// Get the gas limit override if set
				const overrideGasLimit = client.getNextBlockGasLimit()
				const gasLimit = overrideGasLimit ?? parentBlock.header.gasLimit

				// Get the base fee override if set (only for the first block)
				const overrideBaseFee = count === 0 ? client.getNextBlockBaseFeePerGas() : undefined
				const baseFeePerGas = overrideBaseFee ?? parentBlock.header.calcNextBaseFee()
				// Clear the base fee override after using it
				if (count === 0 && overrideBaseFee !== undefined) {
					client.setNextBlockBaseFeePerGas(undefined)
				}

				const blockBuilder = await vm.buildBlock({
					parentBlock,
					headerData: {
						timestamp,
						number: parentBlock.header.number + 1n,
						gasLimit,
						baseFeePerGas,
					},
					blockOpts: {
						freeze: false,
						setHardfork: false,
						putBlockIntoBlockchain: false,
						common: vm.common,
					},
				})

				const orderedTx = await pool.txsByPriceAndNonce({
					baseFee: baseFeePerGas,
				})

				let index = 0
				const blockFull = false
				/**
				 * @type {Array<import('@tevm/receipt-manager').TxReceipt>}
				 */
				const receipts = []
				/**
				 * @type {Array<{tx: import('@tevm/tx').TypedTransaction, receipt: import('@tevm/receipt-manager').TxReceipt, result: any}>}
				 */
				const txResults = []

				while (index < orderedTx.length && !blockFull) {
					const nextTx = /** @type {import('@tevm/tx').TypedTransaction}*/ (orderedTx[index])
					client.logger.debug({ hash: bytesToHex(nextTx.hash()) }, 'new tx added')
					const txResult = await blockBuilder.addTransaction(nextTx, {
						skipBalance: true,
						skipNonce: true,
						skipHardForkValidation: true,
					})
					receipts.push(txResult.receipt)
					txResults.push({ tx: nextTx, receipt: txResult.receipt, result: txResult })
					index++
				}

				await vm.stateManager.checkpoint()
				const createNewStateRoot = true
				await vm.stateManager.commit(createNewStateRoot)
				const block = await blockBuilder.build()
				await Promise.all([receiptsManager.saveReceipts(block, receipts), vm.blockchain.putBlock(block)])
				pool.removeNewBlockTxs([block])

				// Build detailed transaction info
				/**
				 * @type {import('./AnvilResult.js').AnvilMineDetailedResult['blocks'][0]['transactions']}
				 */
				const transactions = txResults.map(({ tx, receipt, result }) => {
					const receiptAny = /** @type {any} */ (receipt)
					const status = receiptAny.status === 1 || receiptAny.status === '0x1' ? '0x1' : '0x0'

					/** @type {import('./AnvilResult.js').AnvilMineDetailedResult['blocks'][0]['transactions'][0]['logs']} */
					const logs = (receiptAny.logs ?? []).map((/** @type {any} */ log) => ({
						address: typeof log[0] === 'string' ? log[0] : bytesToHex(log[0]),
						topics: (log[1] ?? []).map((/** @type {any} */ topic) =>
							typeof topic === 'string' ? topic : bytesToHex(topic),
						),
						data: typeof log[2] === 'string' ? log[2] : bytesToHex(log[2] ?? new Uint8Array(0)),
					}))

					return {
						hash: /** @type {import('@tevm/utils').Hex} */ (bytesToHex(tx.hash())),
						from: /** @type {import('@tevm/utils').Hex} */ (bytesToHex(tx.getSenderAddress().bytes)),
						...(tx.to ? { to: /** @type {import('@tevm/utils').Hex} */ (bytesToHex(tx.to.bytes)) } : {}),
						gasUsed: /** @type {import('@tevm/utils').Hex} */ (
							numberToHex(receiptAny.cumulativeBlockGasUsed ?? 0n)
						),
						status: /** @type {'0x0' | '0x1'} */ (status),
						...(result.createdAddress
							? { contractAddress: /** @type {import('@tevm/utils').Hex} */ (bytesToHex(result.createdAddress.bytes)) }
							: {}),
						logs,
					}
				})

				blocks.push({
					number: /** @type {import('@tevm/utils').Hex} */ (numberToHex(block.header.number)),
					hash: /** @type {import('@tevm/utils').Hex} */ (bytesToHex(block.hash())),
					timestamp: /** @type {import('@tevm/utils').Hex} */ (numberToHex(block.header.timestamp)),
					gasUsed: /** @type {import('@tevm/utils').Hex} */ (numberToHex(block.header.gasUsed)),
					gasLimit: /** @type {import('@tevm/utils').Hex} */ (numberToHex(block.header.gasLimit)),
					transactions,
				})

				const value = vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot))
				if (!value) {
					return {
						jsonrpc: '2.0',
						method: request.method,
						error: {
							code: -32000,
							message: 'State root not found in mineHandler',
						},
						...(request.id !== undefined ? { id: request.id } : {}),
					}
				}

				originalVm.stateManager.saveStateRoot(block.header.stateRoot, value)
			}

			originalVm.blockchain = vm.blockchain
			originalVm.evm.blockchain = vm.evm.blockchain
			// @ts-expect-error
			receiptsManager.chain = vm.evm.blockchain
			await originalVm.stateManager.setStateRoot(hexToBytes(vm.stateManager._baseState.getCurrentStateRoot()))

			return {
				jsonrpc: '2.0',
				method: request.method,
				result: { blocks },
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} catch (e) {
			client.logger.error(e, 'anvilMineDetailedProcedure error')
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: {
					code: -32000,
					message: /** @type {Error} */ (e).message,
				},
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} finally {
			client.status = 'READY'
		}
	}
}
