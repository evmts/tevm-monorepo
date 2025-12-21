import { parseGwei } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { ethFeeHistoryHandler } from './ethFeeHistoryHandler.js'

describe(ethFeeHistoryHandler.name, () => {
	const createMockBlock = (
		number: bigint,
		baseFeePerGas = parseGwei('1'),
		gasUsed = 15000000n,
		gasLimit = 30000000n,
		transactions: any[] = [],
	) => ({
		header: {
			number,
			baseFeePerGas,
			gasUsed,
			gasLimit,
		},
		transactions,
	})

	const createMockVm = (currentBlockNumber: bigint, blocks: Map<bigint, any> = new Map()) => ({
		blockchain: {
			getCanonicalHeadBlock: () => Promise.resolve(createMockBlock(currentBlockNumber)),
			getBlock: (blockNumber: bigint) => {
				const block = blocks.get(blockNumber)
				if (block) return Promise.resolve(block)
				return Promise.resolve(createMockBlock(blockNumber))
			},
		},
	})

	it('should return fee history for local devnet', async () => {
		const mockVm = createMockVm(100n)
		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)({
			blockCount: 10n,
			newestBlock: 'latest',
		})

		expect(result.oldestBlock).toBe(91n)
		expect(result.baseFeePerGas).toHaveLength(11) // blockCount + 1 (includes next block prediction)
		expect(result.gasUsedRatio).toHaveLength(10)
		expect(result.reward).toBeUndefined()
	})

	it('should return reward percentiles when requested', async () => {
		const mockVm = createMockVm(50n)
		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)({
			blockCount: 5n,
			newestBlock: 'latest',
			rewardPercentiles: [25, 50, 75],
		})

		expect(result.oldestBlock).toBe(46n)
		expect(result.baseFeePerGas).toHaveLength(6) // blockCount + 1
		expect(result.gasUsedRatio).toHaveLength(5)
		expect(result.reward).toBeDefined()
		expect(result.reward).toHaveLength(5)
		expect(result.reward?.[0]).toHaveLength(3) // 3 percentiles
	})

	it('should handle block number as newestBlock', async () => {
		const mockVm = createMockVm(200n)
		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)({
			blockCount: 10n,
			newestBlock: 150n,
		})

		expect(result.oldestBlock).toBe(141n)
	})

	it('should handle earliest block tag', async () => {
		const mockVm = createMockVm(100n)
		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)({
			blockCount: 5n,
			newestBlock: 'earliest',
		})

		expect(result.oldestBlock).toBe(0n)
		// Only one block (block 0)
		expect(result.gasUsedRatio).toHaveLength(1)
	})

	it('should handle zero block count gracefully', async () => {
		const mockVm = createMockVm(100n)
		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)({
			blockCount: 0n,
			newestBlock: 'latest',
		})

		// 0 blockCount should return empty arrays or minimal data
		expect(result.oldestBlock).toBeDefined()
		expect(result.baseFeePerGas).toBeDefined()
		expect(result.gasUsedRatio).toBeDefined()
	})

	it('should handle large block counts', async () => {
		const mockVm = createMockVm(100n)
		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)({
			blockCount: 1000n,
			newestBlock: 'latest',
		})

		// Should clamp to available blocks (0 to 100 = 101 blocks)
		expect(result.oldestBlock).toBe(0n)
		expect(result.gasUsedRatio.length).toBeLessThanOrEqual(101)
	})

	it('should calculate gas used ratio correctly', async () => {
		// Create a block with 50% gas usage
		const blocks = new Map([[10n, createMockBlock(10n, parseGwei('1'), 15000000n, 30000000n)]])
		const mockVm = createMockVm(10n, blocks)

		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)({
			blockCount: 1n,
			newestBlock: 10n,
		})

		expect(result.gasUsedRatio[0]).toBeCloseTo(0.5, 5)
	})

	it('should return empty rewards for blocks with no transactions', async () => {
		const blocks = new Map([[10n, createMockBlock(10n, parseGwei('1'), 0n, 30000000n, [])]])
		const mockVm = createMockVm(10n, blocks)

		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
		} as any)({
			blockCount: 1n,
			newestBlock: 10n,
			rewardPercentiles: [50],
		})

		expect(result.reward).toBeDefined()
		expect(result.reward?.[0]).toEqual([0n])
	})
})
