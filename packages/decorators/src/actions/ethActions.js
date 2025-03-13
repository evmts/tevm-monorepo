// Note: Using dynamic imports to avoid circular dependencies
// The actual handlers are loaded at runtime, not during build
export const importEthHandlers = async () => {
	const actions = await import('@tevm/actions')
	return {
		blockNumberHandler: actions.blockNumberHandler,
		chainIdHandler: actions.chainIdHandler,
		ethCallHandler: actions.ethCallHandler,
		gasPriceHandler: actions.gasPriceHandler,
		getBalanceHandler: actions.getBalanceHandler,
		getCodeHandler: actions.getCodeHandler,
		getStorageAtHandler: actions.getStorageAtHandler,
	}
}

/**
 * @returns {import('@tevm/node').Extension<import('./EthActionsApi.js').EthActionsApi>}
 */
export const ethActions = () => async (client) => {
	const wrappedEth = (() => {
		if (!('eth' in client)) {
			return {}
		}
		if (typeof client.eth !== 'object') {
			throw new Error(
				'Cannot extend eth with ethActions decorator. detected a client.eth property that is not an object',
			)
		}
		return client.eth ?? {}
	})()

	const {
		blockNumberHandler,
		chainIdHandler,
		ethCallHandler,
		gasPriceHandler,
		getBalanceHandler,
		getCodeHandler,
		getStorageAtHandler,
	} = await importEthHandlers()

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
