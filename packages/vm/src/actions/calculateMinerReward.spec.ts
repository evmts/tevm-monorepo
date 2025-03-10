import { describe, expect, it } from 'vitest'
import { calculateMinerReward } from './calculateMinerReward.js'

describe('calculateMinerReward', () => {
	it('should calculate miner reward with no ommers', () => {
		const minerReward = 2n * 10n ** 18n // 2 ETH
		const ommersNum = 0

		const reward = calculateMinerReward(minerReward, ommersNum)

		expect(reward).toBe(minerReward)
		expect(reward).toBe(2n * 10n ** 18n)
	})

	it('should calculate miner reward with some ommers', () => {
		const minerReward = 2n * 10n ** 18n // 2 ETH
		const ommersNum = 2

		// Each ommer adds minerReward/32 to the total
		const expectedReward = minerReward + (minerReward / 32n) * 2n
		const reward = calculateMinerReward(minerReward, ommersNum)

		expect(reward).toBe(expectedReward)
		expect(reward).toBe(2n * 10n ** 18n + ((2n * 10n ** 18n) / 32n) * 2n)
	})

	it('should calculate miner reward with maximum ommers', () => {
		const minerReward = 2n * 10n ** 18n // 2 ETH
		const ommersNum = 2 // Maximum is 2 in Ethereum

		const niblingReward = minerReward / 32n
		const totalNiblingReward = niblingReward * BigInt(ommersNum)
		const expectedReward = minerReward + totalNiblingReward

		const reward = calculateMinerReward(minerReward, ommersNum)

		expect(reward).toBe(expectedReward)
	})
})
