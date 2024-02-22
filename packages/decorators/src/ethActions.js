import {
	blockNumberHandler,
	chainIdHandler,
	ethCallHandler,
	gasPriceHandler,
	getBalanceHandler,
	getCodeHandler,
	getStorageAtHandler,
} from '@tevm/actions'
import { eip1993Actions } from './eip1193Actions.js'

/**
 * @returns {import('@tevm/base-client').Extension<import('./providers/EthProvider.js').EthereumProvider>}
 */
export const ethActions = () => (client) => {
	const eip1993 = client.extend(eip1993Actions)
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
