import { Block } from '@tevm/block'
import { optimism } from '@tevm/common'
import { createLogger } from '@tevm/logger'
import { transports } from '@tevm/test-utils'
import { getBlockFromRpc } from '../utils/getBlockFromRpc.js'

let blocks: [Block, Block, Block, Block] | undefined = undefined
/**
 * Retrieves a set of sequential test blocks from Optimism for testing
 *
 * Fetches blocks 122750000 through 122750003 from an Optimism RPC node and
 * caches the results for subsequent calls. This provides a consistent
 * set of blocks for test cases involving blockchain operations.
 *
 * @returns A tuple of four sequential Block objects from Optimism
 *
 * @example
 * ```typescript
 * import { getMockBlocks } from '@tevm/blockchain/test'
 *
 * // Use in tests to get a consistent set of sequential blocks
 * async function testBlockchainFunctions() {
 *   const [block0, block1, block2, block3] = await getMockBlocks()
 *
 *   // Test parent-child relationships
 *   expect(block1.header.parentHash).toEqual(block0.header.hash())
 *
 *   // Test operations across multiple blocks
 *   const blockchain = createBlockchain()
 *   await blockchain.putBlock(block0)
 *   await blockchain.putBlock(block1)
 * }
 * ```
 */
export const getMockBlocks = async (): Promise<[Block, Block, Block, Block]> => {
	blocks =
		blocks ??
		((await Promise.all(
			[122750000n, 122750001n, 122750002n, 122750003n].map((blockTag) =>
				getBlockFromRpc(
					{ logger: createLogger({ name: 'test', level: 'warn' }) } as any,
					{ transport: transports.optimism, blockTag },
					optimism,
				).then((res) => res[0]),
			),
		)) as [Block, Block, Block, Block])
	return blocks
}
