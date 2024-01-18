/**
 * Handler for the `eth_chainId` RPC call.
 * @param {bigint} chainId
 * @returns {import('@tevm/api').EthChainIdHandler}
 */
export const chainIdHandler = (chainId) => async () => {
	return chainId
}
