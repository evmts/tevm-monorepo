import { callProcedure } from '../Call/callProcedure.js'

/**
 * Creates an access list for a transaction.
 * Returns list of addresses and storage keys that the transaction plans to access.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthCreateAccessListJsonRpcProcedure}
 * @ts-ignore - Type mismatch during Zod removal
 */
// @ts-ignore - Type mismatch during Zod removal
export const ethCreateAccessListProcedure = (client) => async (req) => {
	const [tx, blockTag] = req.params
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
				createAccessList: true,
			},
		],
	})

	if (!response.result || !response.result.accessList) {
		/**
		 * @type {import('./EthJsonRpcResponse.js').EthCreateAccessListJsonRpcResponse}
		 */
		const out = {
			jsonrpc: req.jsonrpc,
			method: 'eth_createAccessList',
			error: response.error ?? { code: -32000, message: 'Failed to create access list' },
			...(req.id !== undefined ? { id: req.id } : {}),
		}
		return out
	}

	// Convert the accessList from Record<Address, Set<Hex>> to the expected format
	const formattedAccessList = Object.entries(response.result.accessList).map(([address, storageKeys]) => ({
		address: /** @type {import('abitype').Address}*/ (address),
		storageKeys: Array.from(storageKeys),
	}))

	return {
		jsonrpc: req.jsonrpc,
		method: 'eth_createAccessList',
		result: {
			accessList: formattedAccessList,
			gasUsed: response.result.totalGasSpent ?? '0x0',
		},
		...(req.id !== undefined ? { id: req.id } : {}),
	}
}
