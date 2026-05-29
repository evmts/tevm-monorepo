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

	it('should reject zero block count per the eth_feeHistory spec', async () => {
		const mockVm = createMockVm(100n)
		// Per spec blockCount must be >= 1. Previously blockCount=0 yielded oldestBlock = newest + 1
		// (a block past the requested range) with an empty baseFeePerGas array.
		await expect(
			ethFeeHistoryHandler({
				getVm: () => Promise.resolve(mockVm) as any,
			} as any)({
				blockCount: 0n,
				newestBlock: 'latest',
			}),
		).rejects.toThrow(/blockCount must be at least 1/)
	})

	it('should weight reward percentiles by cumulative gas, not transaction count', async () => {
		// One large-gas, low-tip tx and many tiny-gas high-tip txs.
		// Tx 0: tip 1 gwei, gas 9_000_000 (90% of block gas)
		// Tx 1..9: tip 100 gwei, gas 100_000 each (10% of block gas combined)
		const baseFee = parseGwei('1')
		const lowTipTx = { maxPriorityFeePerGas: parseGwei('1'), maxFeePerGas: parseGwei('1000') }
		const highTipTx = { maxPriorityFeePerGas: parseGwei('100'), maxFeePerGas: parseGwei('1000') }
		const transactions = [lowTipTx, ...Array.from({ length: 9 }, () => highTipTx)]

		// Build cumulative gas: tx0 consumes 9_000_000, each of the next 9 consumes 100_000
		const perTxGas = [9_000_000n, ...Array.from({ length: 9 }, () => 100_000n)]
		let cumulative = 0n
		const receipts = perTxGas.map((g) => {
			cumulative += g
			return { cumulativeBlockGasUsed: cumulative }
		})

		const block = {
			header: { number: 10n, baseFeePerGas: baseFee, gasUsed: 9_900_000n, gasLimit: 30_000_000n },
			transactions,
			hash: () => new Uint8Array(32),
		}
		const blocks = new Map([[10n, block]])
		const mockVm = createMockVm(10n, blocks)

		const result = await ethFeeHistoryHandler({
			getVm: () => Promise.resolve(mockVm) as any,
			getReceiptsManager: () => Promise.resolve({ getReceipts: () => Promise.resolve(receipts) }) as any,
		} as any)({
			blockCount: 1n,
			newestBlock: 10n,
			rewardPercentiles: [50],
		})

		// 50th percentile by gas weight falls inside tx0 (which alone is 90% of block gas),
		// so the reward should be the low tip (1 gwei), NOT the high tip a count-based
		// percentile (50th of 10 txs) would have selected.
		expect(result.reward?.[0]?.[0]).toBe(parseGwei('1'))
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
