import { deepCopy } from './actions/deepCopy.js'
import { getBlock } from './actions/getBlock.js'
import { putBlock } from './actions/putBlock.js'
import { shallowCopy } from './actions/shallowCopy.js'
import { validateHeader } from './actions/validateHeader.js'
import { createBaseChain } from './createBaseChain.js'
/**
 * @param {import('./ChainOptions.js').ChainOptions} options
 * @returns {Promise<import('./Chain.js').Chain>}
 */
export const createChain = async (options) => {
	/**
	 * @param {import('./BaseChain.js').BaseChain} baseChain
	 */
	const decorate = (baseChain) => {
		return {
			...baseChain,
			getBlock: getBlock(baseChain),
			putBlock: putBlock(baseChain),
			validateHeader: validateHeader(baseChain),
			deepCopy: () => decorate(deepCopy(baseChain)()),
			shallowCopy: () => decorate(shallowCopy(baseChain)()),
		}
	}
	return decorate(createBaseChain(options))
}
