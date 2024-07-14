let i = 0
/**
 * Creates a function that logs a warning once
 * @param {import('../BaseChain.js').BaseChain} baseChain
 */
export const warnOnce = (baseChain) => {
	/**
	 * @param {import('viem').RpcBlock} tx
	 */
	return (tx) => {
		if (i > 0) {
			return
		}
		i++
		baseChain.logger.warn(
			`Warning: Optimism deposit transactions (type 0x7e) are currently not supported and will be filtered out of blocks until support is added
filtering out tx ${/** @type {import('viem').RpcBlock}*/ (tx).hash}`,
		)
	}
}
