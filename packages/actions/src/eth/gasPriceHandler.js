import { blockNumberHandler } from './blockNumberHandler.js'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, parseGwei } from '@tevm/utils'

/**
 * @param {Pick<import('@tevm/base-client').BaseClient, 'forkUrl' | 'vm'>} options
 * @returns {import('@tevm/actions-types').EthGasPriceHandler}
 */
export const gasPriceHandler = ({ forkUrl, vm }) => {
	/**
	 * @type {bigint}
	 */
	let gasPrice
	/**
	 * @type {bigint}
	 */
	let blockNumber
	// TODO pass in headers
	const fetcher = createJsonRpcFetcher(forkUrl ?? 'no url set')
	return async () => {
		if (!forkUrl) {
			return parseGwei('1')
		}
		const newBlockNumber = await blockNumberHandler({ vm })({})
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
