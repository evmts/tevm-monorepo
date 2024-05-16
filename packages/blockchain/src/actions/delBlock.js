import { bytesToHex } from 'viem'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['delBlock']}
 */
export const delBlock = (baseChain) => (blockHash) => {
	baseChain.blocks.delete(bytesToHex(blockHash))
	baseChain.logger.debug({ blockHash }, 'deleted block')
	return Promise.resolve()
}
