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
	return {
		eth: {
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
