import {
	blockNumberHandler,
	chainIdHandler,
	ethCallHandler,
	gasPriceHandler,
	getBalanceHandler,
	getCodeHandler,
	getStorageAtHandler,
} from '@tevm/actions'

/**
 * @returns {import('@tevm/base-client').Extension<import('./EthActionsApi.js').EthActionsApi>}
 */
export const ethActions = () => (client) => {
	const wrappedEth = (() => {
		if (!('eth' in client)) {
			return {}
		}
		if (typeof client.eth !== 'object') {
			throw new Error('Cannot extend eth with ethActions decorator. detected a client.eth property that is not an object')
		}
		return client.eth ?? {}
	})()
	return {
		eth: {
			...wrappedEth,
			blockNumber: blockNumberHandler(client),
			call: ethCallHandler(client),
			chainId: chainIdHandler(client),
			gasPrice: gasPriceHandler(client),
			getBalance: getBalanceHandler(client),
			getCode: getCodeHandler(client),
			getStorageAt: getStorageAtHandler(client),
		},
	}
}
