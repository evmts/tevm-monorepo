/**
 * @param {bigint} chainId
 * @returns {import('@tevm/api').EthBlockNumberHandler}
 */
export const chainIdHandler = (chainId) => async () => {
	return chainId
}
