/**
 * Creates a function that logs a warning once
 * @param {import('../BaseChain.js').BaseChain} baseChain
 */
export const warnOnce = (baseChain) => {
	let i = 0
	/**
	 * @param {import('viem').RpcBlock} tx
	 * @returns {void}}
	 */
	return (tx) => {
		if (i > 0) {
			return
		}
		i++
		baseChain.logger.warn(
			`Warning: Optimism and Arbitrum deposit transactions (type 0x7e and 0x6a) are currently not supported and will be filtered out of blocks until support is added
filtering out tx ${/** @type {import('viem').RpcBlock}*/ (tx).hash}.
Note: The block hash will be different because of the excluded txs`,
		)
	}
}
