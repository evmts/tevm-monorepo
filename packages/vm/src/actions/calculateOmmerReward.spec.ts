import { describe, expect, it } from 'vitest'
import { calculateOmmerReward } from './calculateOmmerReward.js'

describe('calculateOmmerReward', () => {
	it('should calculate ommer reward for 1 block difference', () => {
		const ommerBlockNumber = 100n
		const blockNumber = 101n
		const minerReward = 2n * 10n ** 18n // 2 ETH

		// With 1 block difference, reward should be (8-1)/8 * minerReward = 7/8 * minerReward
		const expectedReward = (7n * minerReward) / 8n
		const reward = calculateOmmerReward(ommerBlockNumber, blockNumber, minerReward)

		expect(reward).toBe(expectedReward)
		expect(reward).toBe((7n * 2n * 10n ** 18n) / 8n)
	})

	it('should calculate ommer reward for multiple block difference', () => {
		const ommerBlockNumber = 100n
		const blockNumber = 104n // 4 blocks difference
		const minerReward = 2n * 10n ** 18n // 2 ETH

		// With 4 block difference, reward should be (8-4)/8 * minerReward = 4/8 * minerReward
		const expectedReward = (4n * minerReward) / 8n
		const reward = calculateOmmerReward(ommerBlockNumber, blockNumber, minerReward)

		expect(reward).toBe(expectedReward)
		expect(reward).toBe(1n * 10n ** 18n) // Should be 1 ETH (half of the miner reward)
	})

	it('should return 0 for more than 8 block difference', () => {
		const ommerBlockNumber = 100n
		const blockNumber = 110n // 10 blocks difference
		const minerReward = 2n * 10n ** 18n // 2 ETH

		// With more than 8 blocks difference, reward should be 0
		const reward = calculateOmmerReward(ommerBlockNumber, blockNumber, minerReward)

		expect(reward).toBe(0n)
	})

	it('should handle exactly 8 block difference', () => {
		const ommerBlockNumber = 100n
		const blockNumber = 108n // 8 blocks difference
		const minerReward = 2n * 10n ** 18n // 2 ETH

		// With 8 block difference, reward should be (8-8)/8 * minerReward = 0
		const reward = calculateOmmerReward(ommerBlockNumber, blockNumber, minerReward)

		expect(reward).toBe(0n)
	})
})
