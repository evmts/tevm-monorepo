/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {() => import('../BaseChain.js').BaseChain}
 */
export const shallowCopy = (baseChain) => () => {
	return {
		logger: baseChain.logger,
		options: baseChain.options,
		common: baseChain.common,
		blocks: baseChain.blocks,
		blocksByTag: baseChain.blocksByTag,
		blocksByNumber: baseChain.blocksByNumber,
		ready: baseChain.ready,
	}
}
