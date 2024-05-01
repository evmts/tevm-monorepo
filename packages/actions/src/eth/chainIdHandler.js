/**
 * Handler for the `eth_chainId` RPC call.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthChainIdHandler}
 */
export const chainIdHandler = (client) => async () => {
	const { common } = await client.getVm()
	return common.chainId()
}
