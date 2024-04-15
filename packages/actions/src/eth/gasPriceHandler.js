import { blockNumberHandler } from './blockNumberHandler.js'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, parseGwei } from '@tevm/utils'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthGasPriceHandler}
 */
export const gasPriceHandler = ({ forkUrl, getVm, ...client }) => {
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
		client.logger.debug('gasPriceHandler called')
		if (!forkUrl) {
			client.logger.debug('no fork url set. Returning 1 gwei')
			return parseGwei('1')
		}
		const newBlockNumber = await blockNumberHandler({ ...client, getVm })({})
		client.logger.debug(newBlockNumber, 'current block number')
		if (!gasPrice || blockNumber !== newBlockNumber) {
			client.logger.debug(
				{ gasPrice, blockNumber, newBlockNumber },
				'blockNumber changed or gas price not fetched. Fetching latest gas price',
			)
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
			client.logger.debug(gasPrice, 'returning new gas price')
		} else {
			client.logger.debug(gasPrice, 'returning cached gas price')
		}
		return gasPrice
	}
}
