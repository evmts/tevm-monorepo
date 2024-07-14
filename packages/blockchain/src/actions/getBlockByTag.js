import { hexToBytes, hexToNumber, isHex } from '@tevm/utils'
import { getBlock } from './getBlock.js'
import { UnknownBlockError } from '@tevm/errors'
import { getBlockFromRpc } from '../utils/getBlockFromRpc.js'
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
		const block = await getBlockFromRpc(
			{
				transport: baseChain.options.fork.transport,
				blockTag: blockId,
			},
			baseChain.common,
		)
		await putBlock(baseChain)(block)
		return block
	}
	if (!block) {
		throw new UnknownBlockError(blockId)
	}
	return block
}
