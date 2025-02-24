import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt } from '@tevm/utils'

/**
 * @param {{request: import('viem').EIP1193RequestFn} | import('viem').Transport} client
 */
export const getBlockNumber = async (client) => {
	const transport = typeof client === 'function' ? client({}) : client
	const fetcher = createJsonRpcFetcher(transport)
	const { result: blockNumber, error } = await fetcher.request({
		jsonrpc: '2.0',
		method: 'eth_blockNumber',
		id: 1,
		params: [],
	})
	if (error || blockNumber === undefined) {
		throw error
	}
	return hexToBigInt(/** @type {import("@tevm/utils").Hex}*/ (blockNumber))
}
