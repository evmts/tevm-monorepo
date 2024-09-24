import { TransactionFactory } from '@tevm/tx'
import { hexToBigInt, hexToBytes, hexToNumber, numberToHex } from '@tevm/utils'
import { runTx } from '@tevm/vm'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'
import { requestProcedure } from '../requestProcedure.js'
import { traceCallHandler } from './traceCallHandler.js'

/**
 * Request handler for debug_traceTransaction JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugTraceTransactionProcedure}
 */
export const debugTraceTransactionJsonRpcProcedure = (client) => {
	return async (request) => {
		const { tracer, timeout, tracerConfig, transactionHash } = request.params[0]
		if (timeout !== undefined) {
			client.logger.warn('Warning: timeout is currently respected param of debug_traceTransaction')
		}
		const transactionByHashResponse = await requestProcedure(client)({
			method: 'eth_getTransactionByHash',
			params: [transactionHash],
			jsonrpc: '2.0',
			id: 1,
		})
		if ('error' in transactionByHashResponse) {
			return {
				error: /** @type {any}*/ (transactionByHashResponse.error),
				...(request.id !== undefined ? { id: request.id } : {}),
				jsonrpc: '2.0',
				method: request.method,
			}
		}
		const vm = await client.getVm()
		const block = await vm.blockchain.getBlock(hexToBytes(transactionByHashResponse.result.blockHash))
		const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)
		transactionByHashResponse.result.transactionIndex
		const previousTx = block.transactions.filter(
			(_, i) => i < hexToNumber(transactionByHashResponse.result.transactionIndex),
		)
		const hasStateRoot = vm.stateManager.hasStateRoot(parentBlock.header.stateRoot)
		if (!hasStateRoot && client.forkTransport) {
			await forkAndCacheBlock(client, parentBlock)
		} else {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					// TODO use a @tevm/errors
					code: /** @type any*/ (-32602),
					message: 'Parent block not found',
				},
			}
		}
		const vmClone = await vm.deepCopy()

		// execute all transactions before the current one committing to the state
		for (const tx of previousTx) {
			runTx(vmClone)({
				block: parentBlock,
				skipNonce: true,
				skipBalance: true,
				skipHardForkValidation: true,
				skipBlockGasLimitValidation: true,
				tx: await TransactionFactory.fromRPC(tx, {
					freeze: false,
					common: vmClone.common.ethjsCommon,
					allowUnlimitedInitCodeSize: true,
				}),
			})
		}

		// now execute an debug_traceCall
		const traceResult = await traceCallHandler(client)({
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
			...(transactionByHashResponse.result.data !== undefined ? { data: transactionByHashResponse.result.data } : {}),
			...(transactionByHashResponse.result.blockHash !== undefined
				? { blockTag: transactionByHashResponse.result.blockHash }
				: {}),
			...(timeout !== undefined ? { timeout } : {}),
			...(tracerConfig !== undefined ? { tracerConfig } : {}),
		})
		return {
			method: request.method,
			// TODO the typescript type for this return type is completely wrong because of copy pasta
			// This return value is correct shape
			result: /** @type any*/ ({
				gas: numberToHex(traceResult.gas),
				failed: traceResult.failed,
				returnValue: traceResult.returnValue,
				structLogs: traceResult.structLogs.map((log) => {
					return {
						gas: numberToHex(log.gas),
						gasCost: numberToHex(log.gasCost),
						op: log.op,
						pc: log.pc,
						stack: log.stack,
						depth: log.depth,
					}
				}),
			}),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
