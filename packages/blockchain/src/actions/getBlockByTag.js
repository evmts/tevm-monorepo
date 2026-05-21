import { UnknownBlockError } from '@tevm/errors'
import { hexToBytes, hexToNumber, isHex } from '@tevm/utils'
import { getBlockFromRpc } from '../utils/getBlockFromRpc.js'
import { getBlock } from './getBlock.js'
import { getCanonicalHeadBlock } from './getCanonicalHeadBlock.js'
import { putBlock } from './putBlock.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['getBlockByTag']}
 */
export const getBlockByTag = (baseChain) => async (blockId) => {
	const _getBlock = getBlock(baseChain)
	if (isHex(blockId)) {
		return blockId.length === 66 ? _getBlock(hexToBytes(blockId)) : _getBlock(hexToNumber(blockId))
	}
	if (typeof blockId === 'number' || typeof blockId === 'bigint' || blockId instanceof Uint8Array) {
		return _getBlock(blockId)
	}
	const block = baseChain.blocksByTag.get(blockId)
	if (!block && baseChain.options.fork?.transport) {
		const [block, jsonRpcBlock] = await getBlockFromRpc(
			baseChain,
			{
				transport: baseChain.options.fork.transport,
				blockTag: blockId,
			},
			baseChain.common,
		)
		const forkedBlock = baseChain.blocksByTag.get('forked')
		const latestBlock = await getCanonicalHeadBlock(baseChain)()
		if (forkedBlock && block.header.number > forkedBlock.header.number) {
			throw new UnknownBlockError(
				`The fetched block ${block.header.number} has a higher block height than the forked block ${forkedBlock.header.number} but less than the latest block ${latestBlock.header.number}`,
			)
		}
		await putBlock(baseChain)(block)
		baseChain.blocksByTag.set(blockId, block)
		// because of optimism tx we need to set block hash twice
		if (jsonRpcBlock.hash) {
			baseChain.blocks.set(jsonRpcBlock.hash, block)
		}
		return block
	}
	if (!block) {
		throw new UnknownBlockError(blockId)
	}
	return block
}
