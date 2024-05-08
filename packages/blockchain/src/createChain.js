import { deepCopy } from './actions/deepCopy.js'
import { delBlock } from './actions/delBlock.js'
import { getBlock } from './actions/getBlock.js'
import { getCanonicalHeadBlock } from './actions/getCanonicalHeadBlock.js'
import { getIteratorHead } from './actions/getIteratorHead.js'
import { putBlock } from './actions/putBlock.js'
import { setIteratorHead } from './actions/setIteratorHead.js'
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
		return Object.assign(baseChain, {
			deepCopy: () => decorate(deepCopy(baseChain)()),
			shallowCopy: () => decorate(shallowCopy(baseChain)()),
			getBlock: getBlock(baseChain),
			putBlock: putBlock(baseChain),
			validateHeader: validateHeader(baseChain),
			getCanonicalHeadBlock: getCanonicalHeadBlock(baseChain),
			delBlock: delBlock(baseChain),
			getIteratorHead: getIteratorHead(baseChain),
			setIteratorHead: setIteratorHead(baseChain),
			/**
			 * @type {import('@ethereumjs/blockchain').BlockchainInterface['consensus']}
			 */
			get consensus() {
				throw new Error('consensus is not implemented')
			},
			/**
			 * @type {import('@ethereumjs/blockchain').BlockchainInterface['iterator']}
			 */
			get iterator() {
				throw new Error('iterator is not implemented')
			},
		})
	}
	return decorate(createBaseChain(options))
}
