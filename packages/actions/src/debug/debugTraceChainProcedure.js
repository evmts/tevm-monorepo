import { createAddress } from '@tevm/address'
import { createImpersonatedTx } from '@tevm/tx'
import { bytesToHex } from '@tevm/utils'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'
import { serializeTraceResult } from '../internal/serializeTraceResult.js'
import { traceCallHandler } from './traceCallHandler.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_traceChain` method
 *
 * This handler traces all transactions in a range of blocks, providing detailed
 * traces for each transaction. This can generate large amounts of data for
 * block ranges with many transactions, so use with caution.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @returns {import('./DebugProcedure.js').DebugTraceChainProcedure} A handler function for debug_traceChain requests
 * @throws {Error} If any block in the range cannot be found
 * @throws {Error} If the parent block's state root is not available and cannot be forked
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { debugTraceChainJsonRpcProcedure } from '@tevm/actions'
 *
 * // Create a node with automatic mining
 * const node = createTevmNode({ miningConfig: { type: 'auto' } })
 *
 * // Get the current block number
 * const currentBlock = await node.getBlockNumber()
 *
 * // Create the debug procedure handler
 * const debugProcedure = debugTraceChainJsonRpcProcedure(node)
 *
 * // Trace all transactions between two blocks
 * const response = await debugProcedure({
 *   jsonrpc: '2.0',
 *   method: 'debug_traceChain',
 *   params: [
 *     currentBlock - 5n, // Start block
 *     currentBlock,      // End block
 *     {
 *       tracer: 'callTracer',
 *       tracerConfig: {}
 *     }
 *   ],
 *   id: 1
 * })
 *
 * console.log('Chain traces:', response.result)
 * // Output: Array of block results, each containing traces for all transactions
 * ```
 */
export const debugTraceChainJsonRpcProcedure = (client) => {
	/**
	 * @template {'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceChainJsonRpcRequest<TTracer, TDiffMode>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceChainJsonRpcResponse<TTracer, TDiffMode>>}
	 */
	return async (request) => {
		const [startBlockParam, endBlockParam, options = {}] = request.params
		const tracer = 'tracer' in options ? options.tracer : undefined
		const timeout = 'timeout' in options ? options.timeout : undefined
		const tracerConfig = 'tracerConfig' in options ? options.tracerConfig : undefined

		if (timeout !== undefined) {
			client.logger.warn('Warning: timeout is currently not fully respected in debug_traceChain')
		}

		client.logger.debug(
			{ startBlock: startBlockParam, endBlock: endBlockParam, tracer, tracerConfig },
			'debug_traceChain: executing with params',
		)

		let vm = await client.getVm()

		// Resolve block numbers
		const startBlock = await vm.blockchain.getBlockByTag(startBlockParam)
		const endBlock = await vm.blockchain.getBlockByTag(endBlockParam)

		const startBlockNumber = Number(startBlock.header.number)
		const endBlockNumber = Number(endBlock.header.number)

		// Validate block range
		if (startBlockNumber > endBlockNumber) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					code: '-32602',
					message: `Invalid block range: start block ${startBlockNumber} is after end block ${endBlockNumber}`,
				},
			}
		}

		// Warn if the range is large
		const blockCount = endBlockNumber - startBlockNumber + 1
		if (blockCount > 100) {
			client.logger.warn(
				{ blockCount, startBlockNumber, endBlockNumber },
				'debug_traceChain: tracing large block range, this may take a long time',
			)
		}

		/** @type {Array<{blockNumber: number, blockHash: import('@tevm/utils').Hex, txTraces: Array<{txHash: import('@tevm/utils').Hex, txIndex: number, result: any}>}>} */
		const chainTraces = []

		// Trace each block in the range
		for (let blockNum = startBlockNumber; blockNum <= endBlockNumber; blockNum++) {
			const block = await vm.blockchain.getBlockByTag(blockNum)

			// Skip blocks with no transactions
			if (block.transactions.length === 0) {
				chainTraces.push({
					blockNumber: blockNum,
					blockHash: bytesToHex(block.header.hash()),
					txTraces: [],
				})
				continue
			}

			const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)

			// Ensure the parent block's state root is available
			const hasStateRoot = await vm.stateManager.hasStateRoot(parentBlock.header.stateRoot)
			if (!hasStateRoot && client.forkTransport) {
				vm = await forkAndCacheBlock(client, parentBlock)
			} else if (!hasStateRoot) {
				return {
					jsonrpc: '2.0',
					method: request.method,
					...(request.id !== undefined ? { id: request.id } : {}),
					error: {
						code: '-32602',
						message: `State root not available for parent of block ${blockNum}`,
					},
				}
			}

			// Clone the VM and set initial state for this block
			const vmClone = await vm.deepCopy()
			await vmClone.stateManager.setStateRoot(parentBlock.header.stateRoot)

			/** @type {Array<{txHash: import('@tevm/utils').Hex, txIndex: number, result: any}>} */
			const txTraces = []

			// Trace each transaction in this block
			for (let i = 0; i < block.transactions.length; i++) {
				const blockTx = block.transactions[i]
				if (!blockTx) continue

				const impersonatedTx = createImpersonatedTx(
					{
						...blockTx,
						gasPrice: null,
						impersonatedAddress: createAddress(blockTx.getSenderAddress()),
					},
					{
						freeze: false,
						common: vmClone.common.ethjsCommon,
						allowUnlimitedInitCodeSize: true,
					},
				)

				// Trace the transaction
				const txParams = impersonatedTx.toJSON()
				const traceResult = await traceCallHandler({ ...client, getVm: () => Promise.resolve(vmClone) })({
					tracer,
					from: impersonatedTx.getSenderAddress().toString(),
					blockTag: bytesToHex(block.header.hash()),
					...(txParams.to !== undefined ? { to: txParams.to } : {}),
					...(txParams.gasLimit !== undefined ? { gas: BigInt(txParams.gasLimit) } : {}),
					...(txParams.gasPrice !== undefined ? { gasPrice: BigInt(txParams.gasPrice) } : {}),
					...(txParams.value !== undefined ? { value: BigInt(txParams.value) } : {}),
					...(txParams.data !== undefined ? { data: txParams.data } : {}),
					...(timeout !== undefined ? { timeout } : {}),
					.../** @type {any} */ (tracerConfig !== undefined ? { tracerConfig } : {}),
				})

				// Add to traces
				txTraces.push({
					txHash: bytesToHex(blockTx.hash()),
					txIndex: i,
					result: traceResult,
				})

				// Actually run the transaction to update vmClone state
				await vmClone.runTx({
					block,
					skipNonce: true,
					skipBalance: true,
					skipHardForkValidation: true,
					skipBlockGasLimitValidation: true,
					tx: impersonatedTx,
				})
			}

			chainTraces.push({
				blockNumber: blockNum,
				blockHash: bytesToHex(block.header.hash()),
				txTraces,
			})
		}

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: /** @type {any} */ (
				chainTraces.map((blockTrace) => ({
					...blockTrace,
					txTraces: blockTrace.txTraces.map((txTrace) => ({
						...txTrace,
						result: serializeTraceResult(txTrace.result),
					})),
				}))
			),
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
