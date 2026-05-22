import { hexToBigInt, numberToHex } from '@tevm/utils'
import { ethFeeHistoryHandler } from './ethFeeHistoryHandler.js'

/**
 * JSON-RPC procedure for `eth_feeHistory`.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthFeeHistoryJsonRpcProcedure}
 */
export const ethFeeHistoryProcedure = (client) => {
	const handler = ethFeeHistoryHandler(client)
	return async (req) => {
		const [blockCountHex, newestBlock, rewardPercentiles] = req.params

		// Convert hex block count to bigint
		const blockCount = hexToBigInt(blockCountHex)

		// Convert block tag/number
		/** @type {import('@tevm/utils').BlockTag | bigint} */
		const newestBlockParam =
			newestBlock.startsWith('0x') && newestBlock.length > 10
				? hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (newestBlock))
				: /** @type {import('@tevm/utils').BlockTag} */ (newestBlock)

		try {
			const result = await handler({
				blockCount,
				newestBlock: newestBlockParam,
				...(rewardPercentiles !== undefined ? { rewardPercentiles } : {}),
			})

			/** @type {import('./EthJsonRpcResponse.js').EthFeeHistoryJsonRpcResponse['result']} */
			const jsonRpcResult = {
				oldestBlock: numberToHex(result.oldestBlock),
				baseFeePerGas: result.baseFeePerGas.map((fee) => numberToHex(fee)),
				gasUsedRatio: result.gasUsedRatio,
			}
			if (result.reward !== undefined) {
				jsonRpcResult.reward = result.reward.map((blockRewards) => blockRewards.map((r) => numberToHex(r)))
			}

			return /** @type {import('./EthJsonRpcResponse.js').EthFeeHistoryJsonRpcResponse}*/ ({
				...(req.id !== undefined ? { id: req.id } : {}),
				jsonrpc: '2.0',
				method: req.method,
				result: jsonRpcResult,
			})
		} catch (e) {
			const error = /** @type {Error} */ (e)
			return /** @type {import('./EthJsonRpcResponse.js').EthFeeHistoryJsonRpcResponse}*/ ({
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
