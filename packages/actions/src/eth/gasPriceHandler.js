import { blockNumberHandler } from './blockNumberHandler.js'
import { fetchFromProvider } from '@ethereumjs/util'
import { hexToBigInt, parseGwei } from 'viem'

/**
 * @param {object} options
 * @param {string} [options.forkUrl]
 * @param {import('@tevm/vm').TevmVm} options.vm
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
	return async () => {
		if (!forkUrl) {
			return parseGwei('1')
		}
		const newBlockNumber = await blockNumberHandler(vm)({})
		if (!gasPrice || blockNumber !== newBlockNumber) {
			blockNumber = newBlockNumber
			gasPrice = await fetchFromProvider(forkUrl, {
				method: 'eth_gasPrice',
				params: [],
			}).then((gasPrice) => hexToBigInt(gasPrice))
		}
		return gasPrice
	}
}
