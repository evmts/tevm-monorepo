import { Block } from '@tevm/block'
import { blockFromRpc } from '@tevm/block'
import { optimism } from '@tevm/common'
import { numberToHex } from 'viem'

let blocks: [Block, Block, Block, Block] | undefined
const emptyRoot = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
const emptyBloom = `0x${'00'.repeat(256)}` as const
const blockNumbers = [122750000n, 122750001n, 122750002n, 122750003n] as const
export const mockRpcHashes = [
	`0x${'01'.padStart(64, '0')}`,
	`0x${'02'.padStart(64, '0')}`,
	`0x${'03'.padStart(64, '0')}`,
	`0x${'04'.padStart(64, '0')}`,
] as const

const createMockRpcBlock = (number: bigint, hash: `0x${string}`, parentHash: `0x${string}`) => ({
	number: numberToHex(number),
	hash,
	parentHash,
	nonce: '0x0000000000000000',
	sha3Uncles: emptyRoot,
	logsBloom: emptyBloom,
	transactionsRoot: emptyRoot,
	stateRoot: emptyRoot,
	receiptsRoot: emptyRoot,
	miner: '0x4200000000000000000000000000000000000011',
	difficulty: '0x0',
	totalDifficulty: '0x0',
	extraData: '0x',
	size: '0x1',
	gasLimit: '0x1c9c380',
	gasUsed: '0x0',
	timestamp: numberToHex(number),
	transactions: [],
	uncles: [],
	baseFeePerGas: '0x1',
	withdrawals: [],
	withdrawalsRoot: emptyRoot,
	blobGasUsed: '0x0',
	excessBlobGas: '0x0',
	parentBeaconBlockRoot: emptyRoot,
	requestsRoot: emptyRoot,
	requests: [],
})

export const mockRpcBlocks = [
	createMockRpcBlock(blockNumbers[0], mockRpcHashes[0], `0x${'00'.repeat(32)}`),
	createMockRpcBlock(blockNumbers[1], mockRpcHashes[1], mockRpcHashes[0]),
	createMockRpcBlock(blockNumbers[2], mockRpcHashes[2], mockRpcHashes[1]),
	createMockRpcBlock(blockNumbers[3], mockRpcHashes[3], mockRpcHashes[2]),
] as const

export const mockTransport = {
	request: async ({ method, params }: { method: string; params?: any[] }) => {
		const [blockTag] = params ?? []
		if (method === 'eth_getBlockByNumber') {
			if (blockTag === 'latest' || blockTag === 'safe' || blockTag === 'finalized' || blockTag === 'pending') {
				return mockRpcBlocks[0]
			}
			if (blockTag === 'earliest') {
				return mockRpcBlocks[0]
			}
			return mockRpcBlocks.find((block) => BigInt(block.number) === BigInt(blockTag)) ?? undefined
		}
		if (method === 'eth_getBlockByHash') {
			return mockRpcBlocks.find((block) => block.hash === blockTag) ?? undefined
		}
		throw new Error(`Unsupported mock RPC method ${method}`)
	},
}
/**
 * Retrieves a set of sequential test blocks from Optimism for testing
 *
 * Builds blocks 122750000 through 122750003 from deterministic RPC fixtures and
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
		(mockRpcBlocks.map((rpcBlock) => {
			const block = blockFromRpc(rpcBlock, {
				common: optimism,
				setHardfork: false,
				freeze: false,
				skipConsensusFormatValidation: true,
			})
			Object.defineProperty(block, '__tevmJsonRpcBlockHash', {
				value: rpcBlock.hash,
				enumerable: false,
				configurable: true,
			})
			return block
		}) as [Block, Block, Block, Block])
	return blocks
}
