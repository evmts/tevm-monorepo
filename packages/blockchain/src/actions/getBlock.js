import { UnknownBlockError } from '@tevm/errors'
import { InvalidBlockError } from '@tevm/errors'
import { bytesToBigInt, bytesToHex } from '@tevm/utils'
import { getBlockFromRpc } from '../utils/getBlockFromRpc.js'
import { getCanonicalHeadBlock } from './getCanonicalHeadBlock.js'
import { putBlock } from './putBlock.js'

/**
 * An ethereumjs interface method that accepts a block id number or hash and returns the block
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
			baseChain.logger.debug({ blockId: bytesToHex(blockId) }, 'getting block by hash or hex encoded number')
			return baseChain.blocks.get(bytesToHex(blockId)) ?? baseChain.blocksByNumber.get(bytesToBigInt(blockId))
		}
		/**
		 * @type {never}
		 */
		const typesafeBlockId = blockId
		throw new InvalidBlockError(`Unknown blockid ${typesafeBlockId}`)
	})()

	if (block !== undefined) {
		baseChain.logger.debug(block.header.toJSON(), 'Block found in cache')
		return block
	}

	if (!baseChain.options.fork?.transport) {
		throw new UnknownBlockError(
			blockId instanceof Uint8Array
				? `Block with hash ${bytesToHex(blockId)} does not exist`
				: `Block number ${blockId} does not exist`,
		)
	}
	baseChain.logger.debug('Fetching block from remote rpc...')

	const [fetchedBlock, jsonRpcFetchedBlock] = await getBlockFromRpc(
		baseChain,
		{
			transport: baseChain.options.fork?.transport,
			blockTag: blockId instanceof Uint8Array ? bytesToHex(blockId) : BigInt(blockId),
		},
		baseChain.common,
	)

	baseChain.logger.debug(fetchedBlock.header.toJSON(), 'Saving forked block to blockchain')

	const forkedBlock = /** @type {import('@tevm/block').Block}*/ (baseChain.blocksByTag.get('forked'))
	const latestBlock = await getCanonicalHeadBlock(baseChain)()
	if (fetchedBlock.header.number > forkedBlock.header.number) {
		throw new InvalidBlockError(`The fetched block ${fetchedBlock.header.number} has a higher block height than the forked block ${forkedBlock.header.number} but less than the latest block ${latestBlock.header.number}
This could indicate a bug in tevm as it implies a block is missing if the internal chain tried fetching it from rpc
Did you manually delete the block? If not consider opening an issue`)
	}

	await putBlock(baseChain)(fetchedBlock)

	// Because we sometimes filter out transactions which affects the hash of the block we need to store the block hash twice otherwise using parent to traverse the chain will fail
	if (jsonRpcFetchedBlock?.hash) {
		baseChain.blocks.set(jsonRpcFetchedBlock.hash, fetchedBlock)
	}

	return fetchedBlock
}
