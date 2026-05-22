import { createImpersonatedTx } from '@evmts/zevm/tx'
import { createAddress } from '@tevm/address'
import { hexToBigInt, hexToBytes, hexToNumber } from '@tevm/utils'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'
import { serializeTraceResult } from '../internal/serializeTraceResult.js'
import { requestProcedure } from '../requestProcedure.js'
import { traceCallHandler } from './traceCallHandler.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_traceTransaction` method
 *
 * This handler traces the execution of a historical transaction using the EVM's step-by-step
 * execution tracing capabilities. It reconstructs the state at the point of the transaction
 * by replaying all previous transactions in the block and then provides a detailed trace.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugTraceTransactionProcedure}
 * @throws {Error} If the transaction cannot be found or its parent state cannot be forked.
 */
export const debugTraceTransactionJsonRpcProcedure = (client) => {
	/**
	 * @template {'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceTransactionJsonRpcRequest<TTracer, TDiffMode>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceTransactionJsonRpcResponse<TTracer, TDiffMode>>}
	 */
	return async (request) => {
		const { tracer, timeout, tracerConfig, transactionHash } = request.params[0]
		if (timeout !== undefined) {
			client.logger.warn('Warning: timeout is currently respected param of debug_traceTransaction')
		}

		client.logger.debug({ transactionHash, tracer, tracerConfig }, 'debug_traceTransaction: executing with params')

		const transactionByHashResponse = await requestProcedure(client)({
			method: 'eth_getTransactionByHash',
			params: [transactionHash],
			jsonrpc: '2.0',
			id: 1,
		})
		if (transactionByHashResponse.error) {
			return {
				error: {
					code: transactionByHashResponse.error.code.toString(),
					message: transactionByHashResponse.error.message,
				},
				...(request.id !== undefined ? { id: request.id } : {}),
				jsonrpc: '2.0',
				method: request.method,
			}
		}
		if (transactionByHashResponse.result === null) {
			return {
				error: {
					code: '-32602',
					message: 'Transaction not found',
				},
				...(request.id !== undefined ? { id: request.id } : {}),
				jsonrpc: '2.0',
				method: request.method,
			}
		}

		let vm = await client.getVm()
		const block = await vm.blockchain.getBlock(hexToBytes(transactionByHashResponse.result.blockHash))
		const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)
		const previousTx = block.transactions.filter(
			(_, i) => i < hexToNumber(transactionByHashResponse.result.transactionIndex),
		)

		// handle the case where the state root is from a preforked block
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

		// clone the VM and set initial state
		const vmClone = await vm.deepCopy()
		await vmClone.stateManager.setStateRoot(parentBlock.header.stateRoot)

		// execute all transactions before the current one committing to the state
		for (const tx of previousTx) {
			await vmClone.runTx({
				block,
				skipNonce: true,
				skipBalance: true,
				skipHardForkValidation: true,
				skipBlockGasLimitValidation: true,
				tx: createImpersonatedTx(
					{
						nonce: tx.nonce,
						gasLimit: tx.gasLimit,
						value: tx.value,
						data: tx.data,
						impersonatedAddress: createAddress(tx.getSenderAddress()),
						...(tx.to !== undefined ? { to: tx.to } : {}),
						...('accessList' in tx && tx.accessList !== undefined ? { accessList: tx.accessList } : {}),
						...('maxFeePerGas' in tx
							? { maxFeePerGas: tx.maxFeePerGas }
							: 'gasPrice' in tx
								? { maxFeePerGas: tx.gasPrice }
								: {}),
						...('maxPriorityFeePerGas' in tx ? { maxPriorityFeePerGas: tx.maxPriorityFeePerGas } : {}),
					},
					{
						freeze: false,
						common: vmClone.common.ethjsCommon,
						allowUnlimitedInitCodeSize: true,
					},
				),
			})
		}

		// now execute a debug_traceCall
		const traceResult = await traceCallHandler({ ...client, getVm: () => Promise.resolve(vmClone) })({
			tracer,
			...(transactionByHashResponse.result.to !== undefined ? { to: transactionByHashResponse.result.to } : {}),
			...(transactionByHashResponse.result.from !== undefined ? { from: transactionByHashResponse.result.from } : {}),
			...(transactionByHashResponse.result.gas !== undefined
				? { gas: hexToBigInt(transactionByHashResponse.result.gas) }
				: {}),
			...(transactionByHashResponse.result.gasPrice !== undefined
				? { gasPrice: hexToBigInt(transactionByHashResponse.result.gasPrice) }
				: {}),
			...(transactionByHashResponse.result.value !== undefined
				? { value: hexToBigInt(transactionByHashResponse.result.value) }
				: {}),
			...(transactionByHashResponse.result.input !== undefined ? { data: transactionByHashResponse.result.input } : {}),
			...(timeout !== undefined ? { timeout } : {}),
			.../** @type {any} */ (tracerConfig !== undefined ? { tracerConfig } : {}),
		})

		return {
			method: request.method,
			result: /** @type {any} */ (serializeTraceResult(traceResult)),
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
