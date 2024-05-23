import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, parseGwei } from '@tevm/utils'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthGasPriceHandler}
 */
export const gasPriceHandler = ({ forkClient, getVm, ...client }) => {
	/**
	 * @type {bigint}
	 */
	let gasPrice
	/**
	 * @type {bigint}
	 */
	let blockNumber
	// TODO pass in headers
	return async () => {
		if (!forkClient) {
			return parseGwei('1')
		}
		const fetcher = createJsonRpcFetcher(forkClient)
		const newBlockNumber = await blockNumberHandler({ ...client, getVm })({})
		if (!gasPrice || blockNumber !== newBlockNumber) {
			blockNumber = newBlockNumber
			gasPrice = await fetcher
				.request({
					method: 'eth_gasPrice',
					params: [],
					jsonrpc: '2.0',
					id: 1,
				})
				.then(({ result }) => {
					return hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (result))
				})
		}
		return gasPrice
	}
}
