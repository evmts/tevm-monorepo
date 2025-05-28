import { Block } from '@tevm/block'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import type { BaseVm } from '../BaseVm.js'
import { assignBlockRewards } from './assignBlockRewards.js'

// Import rewardAccount to spy on it
import * as rewardAccountModule from './rewardAccount.js'

describe('assignBlockRewards', () => {
	it('should assign rewards to miner and ommers', async () => {
		// Create a spy on rewardAccount
		const spy = vi.spyOn(rewardAccountModule, 'rewardAccount').mockImplementation(async () => new EthjsAccount())

		try {
			// Mock VM for testing
			const minerReward = 2000000000000000000n // 2 ETH
			const mockVm = {
				common: {
					ethjsCommon: {
						param: (name: string) => {
							if (name === 'minerReward') {
								return minerReward
							}
							return 0n
						},
					},
				},
				evm: {},
			} as unknown as BaseVm

			// Create mock miner and ommer addresses
			const minerAddr = new EthjsAddress(Buffer.from('1234567890123456789012345678901234567890', 'hex'))
			const ommer1Addr = new EthjsAddress(Buffer.from('2234567890123456789012345678901234567890', 'hex'))
			const ommer2Addr = new EthjsAddress(Buffer.from('3234567890123456789012345678901234567890', 'hex'))

			// Create mock block with ommers
			const mockBlock = {
				header: {
					coinbase: minerAddr,
					number: 100n,
				},
				uncleHeaders: [
					{
						coinbase: ommer1Addr,
						number: 99n, // 1 block difference
					},
					{
						coinbase: ommer2Addr,
						number: 97n, // 3 blocks difference
					},
				],
			} as unknown as Block

			// Apply block rewards
			await assignBlockRewards(mockVm)(mockBlock)

			// Verify that rewardAccount was called for each address
			expect(spy).toHaveBeenCalledTimes(3)

			// Verify calls by checking the values passed
			const calls = spy.mock.calls

			// Find call for each address by comparing the address bytes
			const minerCall = calls.find((call) => call[1].equals(minerAddr))
			const ommer1Call = calls.find((call) => call[1].equals(ommer1Addr))
			const ommer2Call = calls.find((call) => call[1].equals(ommer2Addr))

			// Verify that miner got full reward + (1/32 * reward) for each ommer
			const expectedMinerReward = minerReward + (2n * minerReward) / 32n
			expect(minerCall).toBeDefined()
			expect(minerCall?.[2]).toBe(expectedMinerReward)

			// Verify that ommer1 got 7/8 of the reward (1 block difference)
			const expectedOmmer1Reward = (7n * minerReward) / 8n
			expect(ommer1Call).toBeDefined()
			expect(ommer1Call?.[2]).toBe(expectedOmmer1Reward)

			// Verify that ommer2 got 5/8 of the reward (3 blocks difference)
			const expectedOmmer2Reward = (5n * minerReward) / 8n
			expect(ommer2Call).toBeDefined()
			expect(ommer2Call?.[2]).toBe(expectedOmmer2Reward)
		} finally {
			// Restore the original implementation
			spy.mockRestore()
		}
	})

	it('should assign rewards to miner with no ommers', async () => {
		// Create a spy on rewardAccount
		const spy = vi.spyOn(rewardAccountModule, 'rewardAccount').mockImplementation(async () => new EthjsAccount())

		try {
			// Mock VM with fixed rewards
			const minerReward = 2000000000000000000n // 2 ETH
			const mockVm = {
				common: {
					ethjsCommon: {
						param: () => minerReward,
					},
				},
				evm: {},
			} as unknown as BaseVm

			// Create mock miner address
			const minerAddr = new EthjsAddress(Buffer.from('1234567890123456789012345678901234567890', 'hex'))

			// Create mock block with no ommers
			const mockBlock = {
				header: {
					coinbase: minerAddr,
					number: 100n,
				},
				uncleHeaders: [],
			} as unknown as Block

			// Apply block rewards
			await assignBlockRewards(mockVm)(mockBlock)

			// Verify that rewardAccount was called only for miner
			expect(spy).toHaveBeenCalledTimes(1)

			// Check correct reward amount for miner
			expect(spy).toHaveBeenCalledWith(mockVm.evm, minerAddr, minerReward)
		} finally {
			// Restore the original implementation
			spy.mockRestore()
		}
	})
})
