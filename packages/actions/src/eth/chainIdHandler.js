/**
 * Handler for the `eth_chainId` RPC call.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthChainIdHandler}
 */
export const chainIdHandler = (client) => async () => {
	const { common } = await client.getVm()
	return BigInt(common.id)
}
