/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['delBlock']}
 */
export const delBlock = (baseChain) => (blockHash) => {
	baseChain.blocks.delete(blockHash)
	return Promise.resolve()
}
