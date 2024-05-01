/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('@ethereumjs/blockchain').BlockchainInterface['delBlock']}
 */
export const delBlock = (baseChain) => (blockHash) => {
	baseChain.blocks.delete(blockHash)
	return Promise.resolve()
}
