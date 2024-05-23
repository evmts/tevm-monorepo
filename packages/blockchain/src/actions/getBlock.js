import { bytesToHex } from '@tevm/utils'
import { getBlockFromRpc } from '../utils/getBlockFromRpc.js'
import { putBlock } from './putBlock.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['getBlock']}
 */
export const getBlock = (baseChain) => async (blockId) => {
	const block = (() => {
		if (typeof blockId === 'bigint' || typeof blockId === 'number') {
			baseChain.logger.debug({ blockId: BigInt(blockId) }, 'getting block by number')
			return baseChain.blocksByNumber.get(BigInt(blockId))
		}
		if (blockId instanceof Uint8Array) {
			baseChain.logger.debug({ blockId: bytesToHex(blockId) }, 'getting block by hash')
			return baseChain.blocks.get(bytesToHex(blockId))
		}
		/**
		 * @type {never}
		 */
		const typesafeBlockId = blockId
		throw new Error(`Unknown blockid ${typesafeBlockId}`)
	})()

	if (block !== undefined) {
		baseChain.logger.debug(block.header.toJSON(), 'Block found in cache')
		return block
	}

	if (!baseChain.options.fork?.transport) {
		throw new Error(
			blockId instanceof Uint8Array
				? `Block with hash ${bytesToHex(blockId)} does not exist`
				: `Block number ${blockId} does not exist`,
		)
	}
	baseChain.logger.debug('Fetching block from remote rpc...')

	const fetchedBlock = await getBlockFromRpc(
		{
			transport: baseChain.options.fork?.transport,
			blockTag: blockId instanceof Uint8Array ? bytesToHex(blockId) : BigInt(blockId),
		},
		baseChain.common,
	)

	baseChain.logger.debug(fetchedBlock.header.toJSON(), 'Saving forked block to blockchain')

	const forkedBlock = baseChain.blocksByTag.get('forked')
	const latestBlock = baseChain.blocksByTag.get('latest')
	if (!forkedBlock || !latestBlock) {
		throw new Error('TevmInternalError: Expected forked and latest blocktags to exist in tevm blockchain')
	}
	if (fetchedBlock.header.number > latestBlock.header.number) {
		throw new Error(`Current blockheight is ${latestBlock.header.number} and the fork block is ${forkedBlock.header.number}. The block requested has height of ${fetchedBlock.header.number}.
Fetching blocks from future of the current block is not allowed`)
	}
	if (fetchedBlock.header.number > forkedBlock.header.number) {
		throw new Error(`The fetched block ${fetchedBlock.header.number} has a higher block height than the forked block ${forkedBlock.header.number} but less than the latest block ${latestBlock.header.number}
This could indicate a bug in tevm as it implies a block is missing if the internal chain tried fetching it from rpc
Did you manually delete the block? If not consider opening an issue`)
	}

	await putBlock(baseChain)(fetchedBlock)

	return fetchedBlock
}
