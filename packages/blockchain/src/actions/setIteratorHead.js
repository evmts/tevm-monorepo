import { bytesToHex } from 'viem'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('@ethereumjs/blockchain').BlockchainInterface['setIteratorHead']}
 */
export const setIteratorHead = (baseChain) => (tag, headHash) => {
	baseChain.blocksByTag.set(/** @type {import('viem').BlockTag}*/ (tag), baseChain.blocks.get(bytesToHex(headHash)))
	return Promise.resolve()
}
