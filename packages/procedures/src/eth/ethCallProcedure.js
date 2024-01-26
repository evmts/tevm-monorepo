import { callProcedure } from '../index.js'

/**
 * Executes a message call without creating a transaction on the block chain.
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/procedures-types').EthCallJsonRpcProcedure}
 */
export const ethCallProcedure = (evm) => async (req) => {
	const [tx, blockTag] = req.params
	const { data, from, to, gas, gasPrice, value } = tx
	const response = await callProcedure(evm)({
		jsonrpc: req.jsonrpc,
		id: req.id,
		method: 'tevm_call',
		params: {
			data,
			from,
			gas,
			gasPrice,
			value,
			to,
			// @ts-ignore TODO we need to change the call type to take a blockTag instead of a block
			blockTag,
		},
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
