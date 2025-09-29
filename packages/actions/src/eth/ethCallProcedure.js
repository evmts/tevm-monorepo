import { callProcedure } from '../Call/callProcedure.js'

/**
 * Executes a message call without creating a transaction on the block chain.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthCallJsonRpcProcedure}
 */
export const ethCallProcedure = (client) => async (req) => {
	const [tx, blockTag, stateOverrideSet, blockOverrideSet] = req.params
	const { data, from, to, gas, gasPrice, value } = tx
	const response = await callProcedure(client)({
		...(req.id !== undefined ? { id: req.id } : {}),
		jsonrpc: req.jsonrpc,
		method: 'tevm_call',
		params: [
			{
				...(gasPrice !== undefined ? { gasPrice } : {}),
				...(data !== undefined ? { data } : {}),
				...(gas !== undefined ? { gas } : {}),
				...(value !== undefined ? { value } : {}),
				...(to !== undefined ? { to } : {}),
				...(from !== undefined ? { from } : {}),
				...(blockTag !== undefined ? { blockTag } : {}),
				addToBlockchain: false,
			},
			stateOverrideSet,
			blockOverrideSet,
		],
	})
	if (!response.result) {
		return {
			jsonrpc: req.jsonrpc,
			method: 'eth_call',
			error: response.error,
			...(req.id !== undefined ? { id: req.id } : {}),
		}
	}
	return {
		jsonrpc: req.jsonrpc,
		method: 'eth_call',
		result: response.result.rawData,
		...(req.id !== undefined ? { id: req.id } : {}),
	}
}
