import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, parseGwei } from '@tevm/utils'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthMaxPriorityFeePerGasHandler}
 */
export const ethMaxPriorityFeePerGasHandler = ({ forkTransport, getVm, ...client }) => {
	/**
	 * @type {bigint}
	 */
	let maxPriorityFeePerGas
	/**
	 * @type {bigint}
	 */
	let blockNumber
	// TODO pass in headers
	return async () => {
		if (!forkTransport) {
			// Return default 1 gwei for local/non-forked mode
			return parseGwei('1')
		}
		const fetcher = createJsonRpcFetcher(forkTransport)
		const newBlockNumber = await blockNumberHandler({ ...client, getVm })({})
		if (!maxPriorityFeePerGas || blockNumber !== newBlockNumber) {
			blockNumber = newBlockNumber
			maxPriorityFeePerGas = await fetcher
				.request({
					method: 'eth_maxPriorityFeePerGas',
					params: [],
					jsonrpc: '2.0',
					id: 1,
				})
				.then(({ result }) => {
					return hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (result))
				})
		}
		return maxPriorityFeePerGas
	}
}