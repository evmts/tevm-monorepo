import { createBaseChain } from '../createBaseChain.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {() => import('../BaseChain.js').BaseChain}
 */
export const deepCopy = (baseChain) => () => {
	const chain = createBaseChain(baseChain.options)
	chain.blocksByTag = new Map(baseChain.blocksByTag.entries())
	chain.blocks = new Map(baseChain.blocks.entries())
	chain.blocksByNumber = new Map(baseChain.blocksByNumber.entries())
	return chain
}
