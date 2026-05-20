import { InvalidBlockError } from '@tevm/errors'
import { bytesToHex } from 'viem'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['setIteratorHead']}
 */
export const setIteratorHead = (baseChain) => (tag, headHash) => {
	const block = baseChain.blocks.get(bytesToHex(headHash))
	if (!block) {
		return Promise.reject(new InvalidBlockError(`No block with hash ${bytesToHex(headHash)} exists`))
	}
	baseChain.blocksByTag.set(/** @type {import('viem').BlockTag}*/ (tag), block)
	return Promise.resolve()
}
