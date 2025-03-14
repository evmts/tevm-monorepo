import { bytesToHex } from 'viem'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['putBlock']}
 */
export const putBlock = (baseChain) => (block) => {
	if (block.common.vmConfig.chainId() !== baseChain.common.vmConfig.chainId()) {
		throw new Error('Block does not match the chainId of common')
	}
	// skipping validating the blocks
	// skipping validating consensus
	baseChain.blocks.set(bytesToHex(block.hash()), block)
	baseChain.blocksByNumber.set(block.header.number, block)
	const latestBlock = baseChain.blocksByTag.get('latest')
	baseChain.logger.debug(block.hash(), 'Saved new block')
	if (latestBlock === undefined || latestBlock.header.number <= block.header.number) {
		baseChain.logger.debug(block.header.toJSON().number, 'New highest block height. Setting block at latest')
		baseChain.blocksByTag.set('latest', block)
	}
	return Promise.resolve()
}
