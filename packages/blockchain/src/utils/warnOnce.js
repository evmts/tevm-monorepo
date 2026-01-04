/**
 * Creates a function that logs a warning once
 * @param {import('../BaseChain.js').BaseChain} baseChain
 */
export const warnOnce = (baseChain) => {
	let i = 0
	/**
	 * @param {import('@tevm/utils').RpcTransaction} tx
	 * @returns {void}}
	 */
	return (tx) => {
		if (i > 0) {
			return
		}
		i++
		baseChain.logger.warn(
			`Warning: EIP-7702, Optimism and Arbitrum deposit transactions (types 0x4, 0x7e and 0x6a-0x6f) are currently not supported and will be filtered out of blocks until support is added
filtering out tx ${/** @type {import('@tevm/utils').RpcTransaction}*/ (tx).hash}.
Note: The block hash will be different because of the excluded txs`,
		)
	}
}
