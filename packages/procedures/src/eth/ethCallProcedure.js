import { callProcedure } from '../index.js'

/**
 * Executes a message call without creating a transaction on the block chain.
 * @param {import('@ethereumjs/vm').VM} vm
 * @returns {import('@tevm/procedures-types').EthCallJsonRpcProcedure}
 */
export const ethCallProcedure = (vm) => async (req) => {
	const [tx, blockTag] = req.params
	const { data, from, to, gas, gasPrice, value } = tx
	const response = await callProcedure(vm)({
		...(req.id !== undefined ? { id: req.id } : {}),
		jsonrpc: req.jsonrpc,
		method: 'tevm_call',
		params: {
			...(gasPrice !== undefined ? { gasPrice } : {}),
			...(data !== undefined ? { data } : {}),
			...(gas !== undefined ? { gas } : {}),
			...(value !== undefined ? { value } : {}),
			...(to !== undefined ? { to } : {}),
			...(from !== undefined ? { from } : {}),
			...(blockTag !== undefined ? { blockTag } : {}),
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
