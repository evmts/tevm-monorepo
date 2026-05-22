import { createImpersonatedTx } from '@evmts/zevm/tx'
import { createAddress } from '@tevm/address'
import { bytesToHex, hexToBigInt } from '@tevm/utils'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'
import { serializeTraceResult } from '../internal/serializeTraceResult.js'
import { traceCallHandler } from './traceCallHandler.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_traceBlock` method
 *
 * This handler traces the execution of all transactions in a block, providing
 * detailed traces for each transaction. It handles both block hash and block number
 * identifiers and supports multiple tracer types.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugTraceBlockProcedure}
 * @throws {Error} If the block cannot be found or its parent state cannot be forked.
 */
export const debugTraceBlockJsonRpcProcedure = (client) => {
	/**
	 * @template {'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceBlockJsonRpcRequest<TTracer, TDiffMode>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceBlockJsonRpcResponse<TTracer, TDiffMode>>}
	 */
	return async (request) => {
		// Parse parameters from the request
		const { tracer, timeout, tracerConfig, block: blockParam, blockTag, blockHash, blockNumber } = request.params[0]
		if (timeout !== undefined) {
			client.logger.warn('Warning: timeout is currently respected param of debug_traceBlock')
		}

		client.logger.debug({ blockTag, tracer, tracerConfig }, 'debug_traceBlock: executing with params')

		let vm = await client.getVm()
		const block = await vm.blockchain.getBlockByTag(blockParam ?? blockTag ?? blockHash ?? blockNumber ?? 'latest')

		// If no transactions in the block, return empty array
		if (block.transactions.length === 0) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				result: /** @type {any} */ ([]),
			}
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
		for (let i = 0; i < block.transactions.length; i++) {
			const blockTx = block.transactions[i]
			if (!blockTx) continue

			const impersonatedTx = createImpersonatedTx(
				{
					nonce: blockTx.nonce,
					gasLimit: blockTx.gasLimit,
					value: blockTx.value,
					data: blockTx.data,
					impersonatedAddress: createAddress(blockTx.getSenderAddress()),
					...(blockTx.to !== undefined ? { to: blockTx.to } : {}),
					...('accessList' in blockTx && blockTx.accessList !== undefined ? { accessList: blockTx.accessList } : {}),
					...('maxFeePerGas' in blockTx
						? { maxFeePerGas: blockTx.maxFeePerGas }
						: 'gasPrice' in blockTx
							? { maxFeePerGas: blockTx.gasPrice }
							: {}),
					...('maxPriorityFeePerGas' in blockTx ? { maxPriorityFeePerGas: blockTx.maxPriorityFeePerGas } : {}),
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
				...(txParams.to !== undefined ? { to: txParams.to } : {}),
				...(txParams.gasLimit !== undefined ? { gas: hexToBigInt(txParams.gasLimit) } : {}),
				...(txParams.gasPrice !== undefined ? { gasPrice: hexToBigInt(txParams.gasPrice) } : {}),
				...(txParams.value !== undefined ? { value: hexToBigInt(txParams.value) } : {}),
				...(txParams.data !== undefined ? { data: txParams.data } : {}),
				...(timeout !== undefined ? { timeout } : {}),
				.../** @type {any} */ (tracerConfig !== undefined ? { tracerConfig } : {}),
			})

			// Add to results
			traceResults.push({
				txHash: bytesToHex(blockTx.hash()),
				txIndex: i,
				result: traceResult,
			})

			// Actually run the call to update the vmClone state
			await vmClone.runTx({
				block,
				skipNonce: true,
				skipBalance: true,
				skipHardForkValidation: true,
				skipBlockGasLimitValidation: true,
				tx: impersonatedTx,
			})
		}

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: /** @type {any} */ (
				traceResults.map((trace) => ({ ...trace, result: serializeTraceResult(trace.result) }))
			),
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
