import { hexToBigInt, numberToHex } from '@tevm/utils'
import { ethSimulateV1Handler } from './ethSimulateV1Handler.js'

/**
 * JSON-RPC procedure for `eth_simulateV1`.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthSimulateV1JsonRpcProcedure}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSimulateV1Procedure } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const procedure = ethSimulateV1Procedure(node)
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'eth_simulateV1',
 *   id: 1,
 *   params: [{
 *     blockStateCalls: [{
 *       calls: [{ from: '0x...', to: '0x...', data: '0x...' }]
 *     }]
 *   }],
 * })
 * console.log(response.result)
 * ```
 */
export const ethSimulateV1Procedure = (client) => {
	const handler = ethSimulateV1Handler(client)
	return async (req) => {
		const [opts, blockTag] = req.params

		/**
		 * Convert JSON-RPC params to handler params
		 * @param {import('./EthJsonRpcRequest.js').JsonRpcBlockStateCall[]} blockStateCalls
		 * @returns {import('./EthParams.js').EthSimulateV1BlockStateCall[]}
		 */
		const convertBlockStateCalls = (blockStateCalls) => {
			return blockStateCalls.map((block) => ({
				...(block.blockOverrides
					? {
							blockOverrides: {
								...(block.blockOverrides.number !== undefined
									? { number: hexToBigInt(block.blockOverrides.number) }
									: {}),
								...(block.blockOverrides.time !== undefined
									? { time: hexToBigInt(block.blockOverrides.time) }
									: {}),
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
					})) ?? [],
			}))
		}

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
				...(opts.returnFullTransactions !== undefined
					? { returnFullTransactions: opts.returnFullTransactions }
					: {}),
				...(blockTagParam !== undefined ? { blockTag: blockTagParam } : {}),
			})

			/** @type {import('./EthJsonRpcResponse.js').JsonRpcSimulateBlockResult[]} */
			const jsonRpcResult = result.map((blockResult) => ({
				number: numberToHex(blockResult.number),
				hash: blockResult.hash,
				timestamp: numberToHex(blockResult.timestamp),
				gasLimit: numberToHex(blockResult.gasLimit),
				gasUsed: numberToHex(blockResult.gasUsed),
				...(blockResult.baseFeePerGas !== undefined
					? { baseFeePerGas: numberToHex(blockResult.baseFeePerGas) }
					: {}),
				calls: blockResult.calls.map((callResult) => {
					/** @type {import('./EthJsonRpcResponse.js').JsonRpcSimulateCallResult} */
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
					return callRes
				}),
			}))

			return /** @type {import('./EthJsonRpcResponse.js').EthSimulateV1JsonRpcResponse} */ ({
				...(req.id !== undefined ? { id: req.id } : {}),
				jsonrpc: '2.0',
				method: req.method,
				result: jsonRpcResult,
			})
		} catch (e) {
			const error = /** @type {Error} */ (e)
			return /** @type {import('./EthJsonRpcResponse.js').EthSimulateV1JsonRpcResponse} */ ({
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
