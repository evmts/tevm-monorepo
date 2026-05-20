import { InvalidBlockError } from '@tevm/errors'
import { bytesToHex } from 'viem'
import { getBlock } from './getBlock.js'

/**
 * @param {import('@tevm/block').Block} block
 * @returns {`0x${string}` | undefined}
 */
const getJsonRpcBlockHash = (block) => {
	const hash = /** @type {{ __tevmJsonRpcBlockHash?: unknown }} */ (block).__tevmJsonRpcBlockHash
	return typeof hash === 'string' ? /** @type {`0x${string}`} */ (hash) : undefined
}

/**
 * @param {import('@tevm/block').Block} block
 */
const getBlockHashes = (block) => {
	const hashes = [bytesToHex(block.hash())]
	const jsonRpcHash = getJsonRpcBlockHash(block)
	if (jsonRpcHash !== undefined) {
		hashes.push(jsonRpcHash)
	}
	return hashes
}

/**
 * Deletes a block from the blockchain
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['delBlock']}
 * @throws {InvalidBlockError} If the block is the `forked` block
 */
export const delBlock = (baseChain) => async (blockHash) => {
	const block = await getBlock(baseChain)(blockHash)

	const forkedBlock = baseChain.blocksByTag.get('forked')

	if (forkedBlock && block === forkedBlock) {
		throw new InvalidBlockError('Cannot delete the forked block!')
	}

	const blocksToDelete = new Set([block])
	let foundDescendant = true
	while (foundDescendant) {
		foundDescendant = false
		const deletedHashes = new Set([...blocksToDelete].flatMap(getBlockHashes))
		for (const candidate of new Set(baseChain.blocks.values())) {
			if (!candidate) {
				continue
			}
			if (!blocksToDelete.has(candidate) && deletedHashes.has(bytesToHex(candidate.header.parentHash))) {
				blocksToDelete.add(candidate)
				foundDescendant = true
			}
		}
	}

	const parent = await getBlock(baseChain)(block.header.parentHash).catch(() => undefined)
	for (const [tag, taggedBlock] of baseChain.blocksByTag) {
		if (taggedBlock && blocksToDelete.has(taggedBlock)) {
			if (parent) {
				baseChain.blocksByTag.set(tag, parent)
			} else {
				baseChain.blocksByTag.delete(tag)
			}
		}
	}
	for (const blockToDelete of blocksToDelete) {
		for (const [hash, cachedBlock] of baseChain.blocks) {
			if (cachedBlock === blockToDelete) {
				baseChain.blocks.delete(hash)
			}
		}
		if (baseChain.blocksByNumber.get(blockToDelete.header.number) === blockToDelete) {
			baseChain.blocksByNumber.delete(blockToDelete.header.number)
		}
	}
	baseChain.logger.debug({ blockHash, deletedBlocks: blocksToDelete.size }, 'deleted block')
}
