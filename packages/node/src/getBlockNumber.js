import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt } from '@tevm/utils'

/**
 * Gets the current block number from an EIP-1193 transport or transport factory.
 * @param {{request: import('@tevm/utils').EIP1193RequestFn} | import('@tevm/utils').Transport} client - Either a transport object with a request method, or a viem-style transport factory function
 * @returns {Promise<bigint>} The current block number
 */
export const getBlockNumber = async (client) => {
	const transport = /** @type {{request: import('@tevm/utils').EIP1193RequestFn}} */ (typeof client === 'function' ? client({}) : client)
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
