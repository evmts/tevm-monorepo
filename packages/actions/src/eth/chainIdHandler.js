/**
 * Handler for the `eth_chainId` RPC call.
 * @param {Pick<import('@tevm/base-client').BaseClient,'chainId'>} client
 * @returns {import('@tevm/actions-types').EthChainIdHandler}
 */
export const chainIdHandler = (client) => async () => {
	return BigInt(client.chainId)
}
