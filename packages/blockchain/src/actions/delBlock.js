import { InvalidBlockError } from '@tevm/errors'
import { bytesToHex } from '@tevm/utils'
import { getBlock } from './getBlock.js'
import { getCanonicalHeadBlock } from './getCanonicalHeadBlock.js'

/**
 * Deletes a block from the blockchain
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['delBlock']}
 * @throws {InvalidBlockError} If the block is the `forked` block
 */
export const delBlock = (baseChain) => async (blockHash) => {
	const block = await getBlock(baseChain)(blockHash)
	const hexHash = bytesToHex(blockHash)

	const latest = await getCanonicalHeadBlock(baseChain)()
	const forkedBlock = baseChain.blocksByTag.get('forked')

	if (forkedBlock && hexHash === bytesToHex(forkedBlock.hash())) {
		throw new InvalidBlockError('Cannot delete the forked block!')
	}
	if (hexHash === bytesToHex(latest.hash())) {
		const parent = await getBlock(baseChain)(latest.header.parentHash).catch(() => undefined)
		baseChain.blocksByTag.set('latest', parent)
	}
	baseChain.blocksByNumber.delete(block.header.number)
	baseChain.blocks.delete(hexHash)
	baseChain.logger.debug({ blockHash }, 'deleted block')
}
