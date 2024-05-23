import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToNumber } from '@tevm/utils'

/**
 * @param {{request: import('viem').EIP1193RequestFn}} client
 */
export const getChainId = async (client) => {
	const fetcher = createJsonRpcFetcher(client)
	const { result: chainId, error } = await fetcher.request({
		jsonrpc: '2.0',
		method: 'eth_chainId',
		id: 1,
		params: [],
	})
	if (error || chainId === undefined) {
		throw error
	}
	return hexToNumber(/** @type {import("@tevm/utils").Hex}*/ (chainId))
}
