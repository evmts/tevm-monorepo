import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { ethFeeHistoryHandler } from './ethFeeHistoryHandler.js'

describe(ethFeeHistoryHandler.name, () => {
	it('should return mock data when no fork transport is provided', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		
		const result = await ethFeeHistoryHandler({
			getVm: () => ({ blockchain }) as any,
		} as any)({
			blockCount: '0x4',
			newestBlock: 'latest',
		})

		expect(result).toBeDefined()
		expect(result.baseFeePerGas).toBeDefined()
		expect(result.gasUsedRatio).toBeDefined()
		expect(Array.isArray(result.baseFeePerGas)).toBe(true)
		expect(Array.isArray(result.gasUsedRatio)).toBe(true)
		expect(result.baseFeePerGas.length).toBe(5) // blockCount + 1
		expect(result.gasUsedRatio.length).toBe(4) // blockCount
	})

	it('should return reward percentiles when requested', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		
		const result = await ethFeeHistoryHandler({
			getVm: () => ({ blockchain }) as any,
		} as any)({
			blockCount: '0x2',
			newestBlock: 'latest',
			rewardPercentiles: [25, 50, 75],
		})

		expect(result).toBeDefined()
		expect(result.reward).toBeDefined()
		expect(Array.isArray(result.reward)).toBe(true)
		expect(result.reward?.length).toBe(2) // blockCount
		
		// Each block should have rewards for all percentiles
		result.reward?.forEach(blockRewards => {
			expect(Array.isArray(blockRewards)).toBe(true)
			expect(blockRewards.length).toBe(3) // 25th, 50th, 75th percentiles
		})
	})

	it('should validate block count limits', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		
		await expect(
			ethFeeHistoryHandler({
				getVm: () => ({ blockchain }) as any,
			} as any)({
				blockCount: '0x401', // 1025 blocks - over limit
				newestBlock: 'latest',
			})
		).rejects.toThrow('Block count too large')
	})

	it('should handle zero block count', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		
		const result = await ethFeeHistoryHandler({
			getVm: () => ({ blockchain }) as any,
		} as any)({
			blockCount: '0x0',
			newestBlock: 'latest',
		})

		expect(result).toBeDefined()
		expect(result.baseFeePerGas.length).toBe(1) // Just next block's fee
		expect(result.gasUsedRatio.length).toBe(0) // No historical blocks
	})

	it('should fetch from fork transport when available', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		
		const result = await ethFeeHistoryHandler({
			forkTransport: transports.mainnet,
			getVm: () => ({ blockchain }) as any,
		} as any)({
			blockCount: '0x1',
			newestBlock: 'latest',
		})

		expect(result).toBeDefined()
		expect(result.baseFeePerGas).toBeDefined()
		expect(result.gasUsedRatio).toBeDefined()
		expect(Array.isArray(result.baseFeePerGas)).toBe(true)
		expect(Array.isArray(result.gasUsedRatio)).toBe(true)
	})
})