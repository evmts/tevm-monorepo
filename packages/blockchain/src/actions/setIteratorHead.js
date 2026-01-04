import { bytesToHex } from '@tevm/utils'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['setIteratorHead']}
 */
export const setIteratorHead = (baseChain) => (tag, headHash) => {
	baseChain.blocksByTag.set(/** @type {import('viem').BlockTag}*/ (tag), baseChain.blocks.get(bytesToHex(headHash)))
	return Promise.resolve()
}
