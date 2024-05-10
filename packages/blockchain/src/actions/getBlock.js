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

  if (!baseChain.options.fork?.url) {
    throw new Error(
      blockId instanceof Uint8Array
        ? `Block with hash ${bytesToHex(blockId)} does not exist`
        : `Block number ${blockId} does not exist`,
    )
  }


  baseChain.logger.debug('Fetching block from remote rpc...')

  const fetchedBlock = await getBlockFromRpc(
    {
      url: baseChain.options.fork?.url,
      blockTag: blockId instanceof Uint8Array ? bytesToHex(blockId) : BigInt(blockId),
    },
    baseChain.common,
  )

  baseChain.logger.debug(fetchedBlock.header.toJSON(), 'Saving forked block to blockchain')

  await putBlock(baseChain)(fetchedBlock)

  return fetchedBlock
}
