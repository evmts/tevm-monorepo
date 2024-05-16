import { numberToHex } from '@tevm/utils'
import { ethGetLogsHandler } from '../../../actions/types/eth/ethGetLogsHandler.js'

/**
 * Executes a message call without creating a transaction on the block chain.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/procedures-types').EthGetLogsJsonRpcProcedure}
 */
export const ethGetLogsProcedure = (client) => async (req) => {
	const result = await ethGetLogsHandler(client)({
		filterParams: req.params[0],
	})
	try {
		const jsonRpcResult = result.map((log) => ({
			address: log.address,
			topics: log.topics,
			data: log.data,
			blockNumber: numberToHex(log.blockNumber),
			transactionHash: log.transactionHash,
			transactionIndex: numberToHex(log.transactionIndex),
			blockHash: log.blockHash,
			logIndex: numberToHex(log.logIndex),
			removed: log.removed,
		}))
		return {
			jsonrpc: req.jsonrpc,
			...(req.id !== undefined ? { id: req.id } : {}),
			method: req.method,
			result: jsonRpcResult,
		}
	} catch (e) {
		return /** @type {any}*/ ({
			jsonrpc: req.jsonrpc,
			...(req.id !== undefined ? { id: req.id } : {}),
			method: req.method,
			error: {
				code: -32000,
				message: /** @type {Error}*/ (e).message,
			},
		})
	}
}
