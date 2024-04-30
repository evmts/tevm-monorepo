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
			getCanonicalHeadBlock: () => {
				const block = baseChain.blocksByTag.get('latest')
				if (!block) {
					throw new Error('No cannonical head exists on blockchain')
				}
				return Promise.resolve(block)
			},
			/**
			 * @type {import('@ethereumjs/blockchain').BlockchainInterface['consensus']}
			 */
			get consensus() {
				throw new Error('consensus is not implemented')
			},
			/**
			 * @type {import('@ethereumjs/blockchain').BlockchainInterface['delBlock']}
			 */
			delBlock: (blockHash) => {
				baseChain.blocks.delete(blockHash)
				return Promise.resolve()
			},
			/**
			 * @type {import('@ethereumjs/blockchain').BlockchainInterface['iterator']}
			 */
			get iterator() {
				throw new Error('iterator is not implemented')
			},
			/**
			 * @type {import('@ethereumjs/blockchain').BlockchainInterface['getIteratorHead']}
			 */
			getIteratorHead: (name = 'vm') => {
				const head = baseChain.blocksByTag.get(/** @type {import('viem').BlockTag}*/ (name))
				if (!head) {
					throw new Error(
						`No block with tag ${name} exists. Current tags include ${[...baseChain.blocksByTag.keys()].join(',')}`,
					)
				}
				return Promise.resolve(head)
			},
			/**
			 * @type {import('@ethereumjs/blockchain').BlockchainInterface['setIteratorHead']}
			 */
			setIteratorHead: (tag, headHash) => {
				baseChain.blocksByTag.set(/** @type {import('viem').BlockTag}*/ (tag), baseChain.blocks.get(headHash))
				return Promise.resolve()
			},
		}
	}
	return decorate(createBaseChain(options))
}
