import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt } from '@tevm/utils'

/**
 * @param {{request: import('viem').EIP1193RequestFn}} client
 */
export const getBlockNumber = async (client) => {
	const fetcher = createJsonRpcFetcher(client)
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
