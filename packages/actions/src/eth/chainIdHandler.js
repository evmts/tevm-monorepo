/**
 * Handler for the `eth_chainId` RPC call.
 * @param {Pick<import('@tevm/base-client').BaseClient,'getChainId'>} client
 * @returns {import('@tevm/actions-types').EthChainIdHandler}
 */
export const chainIdHandler = (client) => async () => {
	return BigInt(await client.getChainId())
}
