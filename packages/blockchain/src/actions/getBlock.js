import { bytesToHex } from '@tevm/utils'
import { getBlockFromRpc } from '../utils/getBlockFromRpc.js'
import { putBlock } from './putBlock.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('@ethereumjs/blockchain').Blockchain['getBlock']}
 */
export const getBlock = (baseChain) => async (blockId) => {
	const block = (() => {
		if (typeof blockId === 'bigint' || typeof blockId === 'number') {
			return baseChain.blocksByNumber.get(BigInt(blockId))
		}
		if (blockId instanceof Uint8Array) {
			return baseChain.blocks.get(bytesToHex(blockId))
		}
		/**
		 * @type {never}
		 */
		const typesafeBlockId = blockId
		throw new Error(`Unknown blockid ${typesafeBlockId}`)
	})()

	if (block !== undefined) {
		return block
	}

	if (!baseChain.options.fork?.url) {
		throw new Error(
			blockId instanceof Uint8Array
				? `Block with hash ${bytesToHex(blockId)} does not exist`
				: `Block number ${blockId} does not exist`,
		)
	}

	const fetchedBlock = await getBlockFromRpc(
		{
			url: baseChain.options.fork?.url,
			blockTag: blockId instanceof Uint8Array ? bytesToHex(blockId) : BigInt(blockId),
		},
		baseChain.common,
	)

	await putBlock(baseChain)(fetchedBlock)

	return getBlock(baseChain)(blockId)
}
