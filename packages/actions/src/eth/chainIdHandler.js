/**
 * Handler for the `eth_chainId` RPC call.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthChainIdHandler}
 */
export const chainIdHandler = (client) => async () => {
	if (client.consensus?.mode === 'light-client') {
		if (client.consensus.getChainId) return client.consensus.getChainId()
		throw new Error('LIGHT_CLIENT_NOT_READY: eth_chainId unavailable until consensus chain id is configured')
	}
	const { common } = await client.getVm()
	return BigInt(common.id)
}
