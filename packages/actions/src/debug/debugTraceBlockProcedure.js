import { bytesToHex, hexToBigInt, numberToHex } from '@tevm/utils'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'
import { requestProcedure } from '../requestProcedure.js'
import { traceCallHandler } from './traceCallHandler.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_traceBlock` method
 *
 * This handler traces the execution of all transactions in a block, providing
 * detailed traces for each transaction. It handles both block hash and block number
 * identifiers and supports multiple tracer types.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @returns {import('./DebugProcedure.js').DebugTraceBlockProcedure} A handler function for debug_traceBlock requests
 * @throws {Error} If the block cannot be found
 * @throws {Error} If the parent block's state root is not available and cannot be forked
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { debugTraceBlockJsonRpcProcedure } from '@tevm/actions'
 *
 * // Create a node with automatic mining
 * const node = createTevmNode({ miningConfig: { type: 'auto' } })
 *
 * // Get a block
 * const blockNumber = await node.getBlockNumber()
 *
 * // Create the debug procedure handler
 * const debugProcedure = debugTraceBlockJsonRpcProcedure(node)
 *
 * // Trace the block
 * const trace = await debugProcedure({
 *   jsonrpc: '2.0',
 *   method: 'debug_traceBlock',
 *   params: [
 *     blockNumber,  // Or block hash as a hex string
 *     {
 *       tracer: 'callTracer',  // Or 'prestateTracer'
 *       tracerConfig: {
 *         // diffMode: true  // Only for prestateTracer
 *       }
 *     }
 *   ],
 *   id: 1
 * })
 *
 * console.log('Block transaction traces:', trace.result)
 * ```
 */
export const debugTraceBlockJsonRpcProcedure = (client) => {
	/**
	 * @template {'callTracer' | 'prestateTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceBlockJsonRpcRequest<TTracer, TDiffMode>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceBlockJsonRpcResponse<TTracer, TDiffMode>>}
	 */
	return async (request) => {
		// Parse parameters from the request
		const { tracer, timeout, tracerConfig, blockTag } = request.params[0]
		if (timeout !== undefined) {
			client.logger.warn('Warning: timeout is currently respected param of debug_traceBlock')
		}

		client.logger.debug({ blockTag, tracer, tracerConfig }, 'debug_traceBlock: executing with params')

		const vm = await client.getVm()
		const block = await vm.blockchain.getBlockByTag(blockTag)

		// If no transactions in the block, return empty array
		if (block.transactions.length === 0) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				result: [],
			}
		}

		// Get all transactions in the block
		const transactionsByHashResponse = await Promise.all(
			block.transactions.map(async (tx) => {
				/** @type {import('@tevm/utils').Hex} */
				const txHash = bytesToHex(tx.hash())
				return {
					txHash,
					tx: await requestProcedure(client)({
						method: 'eth_getTransactionByHash',
						params: [txHash],
						jsonrpc: '2.0',
						id: 1,
					}),
				}
			}),
		)

		const errors = transactionsByHashResponse.filter(({ tx }) => tx.error).map(({ tx }) => tx.error)
		if (errors.length > 0) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					code: '-32602',
					message: 'Received at least one transaction with error',
				},
			}
		}

		const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)
		// Ensure the parent block's state root is available
		const hasStateRoot = await vm.stateManager.hasStateRoot(parentBlock.header.stateRoot)
		if (!hasStateRoot && client.forkTransport) {
			await forkAndCacheBlock(client, parentBlock)
		} else if (!hasStateRoot) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					code: '-32602',
					message: 'State root not available for parent block',
				},
			}
		}

		// Clone the VM and set initial state
		const vmClone = await vm.deepCopy()
		await vmClone.stateManager.setStateRoot(parentBlock.header.stateRoot)

		// Array to store trace results for each transaction
		/** @type {import('./DebugResult.js').DebugTraceBlockResult} */
		const traceResults = []

		// Trace each transaction in the block
		for (let i = 0; i < transactionsByHashResponse.length; i++) {
			const { tx, txHash } = transactionsByHashResponse[i] || {}
			if (!txHash || !tx || !tx.result) continue

			// Trace the transaction
			const traceResult = await traceCallHandler({ ...client, getVm: () => Promise.resolve(vmClone) })({
				tracer,
				...(tx.result.to !== undefined ? { to: tx.result.to } : {}),
				...(tx.result.from !== undefined ? { from: tx.result.from } : {}),
				...(tx.result.gas !== undefined ? { gas: hexToBigInt(tx.result.gas) } : {}),
				...(tx.result.gasPrice !== undefined ? { gasPrice: hexToBigInt(tx.result.gasPrice) } : {}),
				...(tx.result.value !== undefined ? { value: hexToBigInt(tx.result.value) } : {}),
				...(tx.result.input !== undefined ? { data: tx.result.input } : {}),
				...(tx.result.blockHash !== undefined ? { blockTag: tx.result.blockHash } : {}),
				...(timeout !== undefined ? { timeout } : {}),
				.../** @type {any} */ (tracerConfig !== undefined ? { tracerConfig } : {}),
			})

			// Add to results
			traceResults.push({
				txHash,
				txIndex: i,

				result: traceResult,
			})
		}

		// Format results based on tracer type
		if (tracer === 'prestateTracer') {
			// For prestate tracer, return results directly
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				result: /** @type {any} */ (traceResults),
			}
		}
		// For standard tracer, transform results to match expected format
		const transformedResults = traceResults.map((item) => {
			const evmResult = /** @type {import('./DebugResult.js').EvmTracerResult} */ (item.result)

			return {
				txHash: item.txHash,
				txIndex: item.txIndex,
				result: {
					gas: numberToHex(evmResult.gas),
					failed: evmResult.failed,
					returnValue: evmResult.returnValue,
					structLogs: evmResult.structLogs.map((log) => {
						return {
							gas: numberToHex(log.gas),
							gasCost: numberToHex(log.gasCost),
							op: log.op,
							pc: log.pc,
							stack: log.stack,
							depth: log.depth,
							...(log.error ? { error: log.error } : {}),
						}
					}),
				},
			}
		})

		return {
			jsonrpc: '2.0',
			method: request.method,
			...(request.id !== undefined ? { id: request.id } : {}),
			result: /** @type {any} */ (transformedResults),
		}
	}
}
