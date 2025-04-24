import { TransactionFactory } from '@tevm/tx'
import { hexToBigInt, hexToBytes, hexToNumber, numberToHex } from '@tevm/utils'
import { runTx } from '@tevm/vm'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'
import { requestProcedure } from '../requestProcedure.js'
import { traceCallHandler } from './traceCallHandler.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_traceTransaction` method
 *
 * This handler traces the execution of a historical transaction using the EVM's step-by-step
 * execution tracing capabilities. It reconstructs the state at the point of the transaction
 * by replaying all previous transactions in the block and then provides a detailed trace.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @returns {import('./DebugProcedure.js').DebugTraceTransactionProcedure} A handler function for debug_traceTransaction requests
 * @throws {Error} If the transaction cannot be found
 * @throws {Error} If the parent block's state root is not available and cannot be forked
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { createAddress } from '@tevm/address'
 * import { debugTraceTransactionJsonRpcProcedure } from '@tevm/actions'
 * import { SimpleContract } from '@tevm/contract'
 *
 * // Create a node and deploy a contract
 * const node = createTevmNode({ miningConfig: { type: 'auto' } })
 * const contract = SimpleContract.withAddress(createAddress('0x1234').toString())
 *
 * // Deploy contract
 * const deployResult = await node.tevmDeploy(contract.deploy(1n))
 *
 * // Call a contract method that will create a transaction
 * const callResult = await node.tevmCall({
 *   createTransaction: true,
 *   ...contract.write.set(42n)
 * })
 *
 * // Get the transaction hash from the call result
 * const txHash = callResult.txHash
 *
 * // Create the debug procedure handler
 * const debugProcedure = debugTraceTransactionJsonRpcProcedure(node)
 *
 * // Trace the transaction
 * const trace = await debugProcedure({
 *   jsonrpc: '2.0',
 *   method: 'debug_traceTransaction',
 *   params: [{
 *     transactionHash: txHash,
 *     tracer: 'callTracer' // Or other tracer options
 *   }],
 *   id: 1
 * })
 *
 * console.log('Transaction trace:', trace.result)
 * ```
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

		// handle the case where the state root is from a preforked block
		const hasStateRoot = await vm.stateManager.hasStateRoot(parentBlock.header.stateRoot)
		if (!hasStateRoot && client.forkTransport) {
			await forkAndCacheBlock(client, parentBlock)
		} else if (!hasStateRoot) {
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
		await vmClone.stateManager.setStateRoot(parentBlock.header.stateRoot)

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
			...(transactionByHashResponse.result.input !== undefined ? { data: transactionByHashResponse.result.input } : {}),
			...(transactionByHashResponse.result.blockHash !== undefined
				? { blockTag: transactionByHashResponse.result.blockHash }
				: {}),
			...(timeout !== undefined ? { timeout } : {}),
			...(tracerConfig !== undefined ? { tracerConfig } : {}),
		})

		// Handle different tracer result formats
		if (tracer === 'prestateTracer') {
			// For prestate tracer, return the result directly
			return {
				method: request.method,
				result: /** @type any*/ (traceResult), // Return the prestate tracer result directly
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		}
		// For standard tracer, transform the result
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
