import { hexToBigInt, numberToHex } from '@tevm/utils'
import { ethSimulateV2Handler } from './ethSimulateV2Handler.js'

/**
 * JSON-RPC procedure for `eth_simulateV2`.
 * Extends V1 with additional features for contract creation detection and call tracing.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthSimulateV2JsonRpcProcedure}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSimulateV2Procedure } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const procedure = ethSimulateV2Procedure(node)
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'eth_simulateV2',
 *   id: 1,
 *   params: [{
 *     blockStateCalls: [{
 *       calls: [{ from: '0x...', to: '0x...', data: '0x...' }]
 *     }],
 *     includeContractCreationEvents: true,
 *     includeCallTraces: true
 *   }],
 * })
 * console.log(response.result)
 * ```
 */
export const ethSimulateV2Procedure = (client) => {
	const handler = ethSimulateV2Handler(client)
	return async (req) => {
		const [opts, blockTag] = req.params

		/**
		 * Convert JSON-RPC params to handler params
		 * @param {import('./EthJsonRpcRequest.js').JsonRpcBlockStateCallV2[]} blockStateCalls
		 * @returns {import('./EthParams.js').EthSimulateV2BlockStateCall[]}
		 */
		const convertBlockStateCalls = (blockStateCalls) => {
			return blockStateCalls.map((block) => ({
				...(block.blockOverrides
					? {
							blockOverrides: {
								...(block.blockOverrides.number !== undefined
									? { number: hexToBigInt(block.blockOverrides.number) }
									: {}),
								...(block.blockOverrides.time !== undefined ? { time: hexToBigInt(block.blockOverrides.time) } : {}),
								...(block.blockOverrides.gasLimit !== undefined
									? { gasLimit: hexToBigInt(block.blockOverrides.gasLimit) }
									: {}),
								...(block.blockOverrides.feeRecipient !== undefined
									? { feeRecipient: block.blockOverrides.feeRecipient }
									: {}),
								...(block.blockOverrides.prevRandao !== undefined
									? { prevRandao: block.blockOverrides.prevRandao }
									: {}),
								...(block.blockOverrides.baseFeePerGas !== undefined
									? { baseFeePerGas: hexToBigInt(block.blockOverrides.baseFeePerGas) }
									: {}),
								...(block.blockOverrides.blobBaseFee !== undefined
									? { blobBaseFee: hexToBigInt(block.blockOverrides.blobBaseFee) }
									: {}),
							},
						}
					: {}),
				...(block.stateOverrides
					? {
							stateOverrides: Object.fromEntries(
								Object.entries(block.stateOverrides).map(([address, state]) => [
									address,
									{
										...(state.balance !== undefined ? { balance: hexToBigInt(state.balance) } : {}),
										...(state.nonce !== undefined ? { nonce: hexToBigInt(state.nonce) } : {}),
										...(state.code !== undefined ? { code: state.code } : {}),
										...(state.state !== undefined ? { state: state.state } : {}),
										...(state.stateDiff !== undefined ? { stateDiff: state.stateDiff } : {}),
									},
								]),
							),
						}
					: {}),
				calls:
					block.calls?.map((call) => ({
						...(call.from !== undefined ? { from: call.from } : {}),
						...(call.to !== undefined ? { to: call.to } : {}),
						...(call.gas !== undefined ? { gas: hexToBigInt(call.gas) } : {}),
						...(call.gasPrice !== undefined ? { gasPrice: hexToBigInt(call.gasPrice) } : {}),
						...(call.maxFeePerGas !== undefined ? { maxFeePerGas: hexToBigInt(call.maxFeePerGas) } : {}),
						...(call.maxPriorityFeePerGas !== undefined
							? { maxPriorityFeePerGas: hexToBigInt(call.maxPriorityFeePerGas) }
							: {}),
						...(call.value !== undefined ? { value: hexToBigInt(call.value) } : {}),
						...(call.data !== undefined ? { data: call.data } : {}),
						...(call.nonce !== undefined ? { nonce: hexToBigInt(call.nonce) } : {}),
						// V2 feature: gas estimation
						...(call.estimateGas !== undefined ? { estimateGas: call.estimateGas } : {}),
					})) ?? [],
			}))
		}

		/**
		 * Convert call trace to JSON-RPC format
		 * @param {import('./EthResult.js').CallTrace} trace
		 * @returns {import('./EthJsonRpcResponse.js').JsonRpcCallTrace}
		 */
		const convertCallTrace = (trace) => ({
			type: trace.type,
			from: trace.from,
			...(trace.to ? { to: trace.to } : {}),
			...(trace.value !== undefined ? { value: numberToHex(trace.value) } : {}),
			gas: numberToHex(trace.gas),
			gasUsed: numberToHex(trace.gasUsed),
			input: trace.input,
			output: trace.output,
			...(trace.error ? { error: trace.error } : {}),
			...(trace.calls ? { calls: trace.calls.map(convertCallTrace) } : {}),
		})

		/** @type {import('@tevm/utils').BlockTag | bigint | undefined} */
		const blockTagParam = blockTag
			? blockTag.startsWith('0x') && blockTag.length > 10
				? hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (blockTag))
				: /** @type {import('@tevm/utils').BlockTag} */ (blockTag)
			: undefined

		try {
			const result = await handler({
				blockStateCalls: convertBlockStateCalls(opts.blockStateCalls),
				...(opts.traceTransfers !== undefined ? { traceTransfers: opts.traceTransfers } : {}),
				...(opts.validation !== undefined ? { validation: opts.validation } : {}),
				...(opts.returnFullTransactions !== undefined ? { returnFullTransactions: opts.returnFullTransactions } : {}),
				...(opts.includeContractCreationEvents !== undefined
					? { includeContractCreationEvents: opts.includeContractCreationEvents }
					: {}),
				...(opts.includeCallTraces !== undefined ? { includeCallTraces: opts.includeCallTraces } : {}),
				...(blockTagParam !== undefined ? { blockTag: blockTagParam } : {}),
			})

			/** @type {import('./EthJsonRpcResponse.js').JsonRpcSimulateV2BlockResult[]} */
			const jsonRpcResult = result.map((blockResult) => ({
				number: numberToHex(blockResult.number),
				hash: blockResult.hash,
				timestamp: numberToHex(blockResult.timestamp),
				gasLimit: numberToHex(blockResult.gasLimit),
				gasUsed: numberToHex(blockResult.gasUsed),
				...(blockResult.baseFeePerGas !== undefined ? { baseFeePerGas: numberToHex(blockResult.baseFeePerGas) } : {}),
				...(blockResult.feeRecipient ? { feeRecipient: blockResult.feeRecipient } : {}),
				calls: blockResult.calls.map((callResult) => {
					/** @type {import('./EthJsonRpcResponse.js').JsonRpcSimulateV2CallResult} */
					const callRes = {
						returnData: callResult.returnData,
						logs: callResult.logs.map((log) => ({
							address: log.address,
							topics: /** @type {import('@tevm/utils').Hex[]} */ ([...log.topics]),
							data: log.data,
							blockNumber: numberToHex(log.blockNumber),
							transactionHash: log.transactionHash,
							transactionIndex: numberToHex(log.transactionIndex),
							blockHash: log.blockHash,
							logIndex: numberToHex(log.logIndex),
							removed: log.removed,
						})),
						gasUsed: numberToHex(callResult.gasUsed),
						status: numberToHex(callResult.status),
					}
					if (callResult.error) {
						callRes.error = callResult.error
					}
					// V2 features
					if (callResult.contractCreated) {
						callRes.contractCreated = {
							address: callResult.contractCreated.address,
							creator: callResult.contractCreated.creator,
							code: callResult.contractCreated.code,
						}
					}
					if (callResult.estimatedGas !== undefined) {
						callRes.estimatedGas = numberToHex(callResult.estimatedGas)
					}
					if (callResult.trace) {
						callRes.trace = convertCallTrace(callResult.trace)
					}
					return callRes
				}),
			}))

			return /** @type {import('./EthJsonRpcResponse.js').EthSimulateV2JsonRpcResponse} */ ({
				...(req.id !== undefined ? { id: req.id } : {}),
				jsonrpc: '2.0',
				method: req.method,
				result: jsonRpcResult,
			})
		} catch (e) {
			const error = /** @type {Error} */ (e)
			return /** @type {import('./EthJsonRpcResponse.js').EthSimulateV2JsonRpcResponse} */ ({
				...(req.id !== undefined ? { id: req.id } : {}),
				jsonrpc: '2.0',
				method: req.method,
				error: {
					code: -32603,
					message: error.message,
				},
			})
		}
	}
}
