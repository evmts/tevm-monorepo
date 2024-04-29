/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('@ethereumjs/blockchain').Blockchain['putBlock']}
 */
export const putBlock = (baseChain) => (block) => {
	if (block.common.chainId() !== baseChain.common.chainId()) {
		throw new Error('Block does not match the chainId of common')
	}
	// skipping validating the blocks
	// skipping validating consensus
	baseChain.blocks.set(block.header.hash(), block)
	baseChain.blocksByNumber.set(block.header.number, block)
	const latestBlock = baseChain.blocksByTag.get('latest')
	if (latestBlock === undefined || latestBlock.header.number <= block.header.number) {
		baseChain.blocksByTag.set('latest', block)
	}
	return Promise.resolve()
}
