import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { rewardAccount } from './rewardAccount.js'

describe('rewardAccount', () => {
	it('should reward an existing account', async () => {
		// Setup initial account state
		const initialBalance = 100n
		const address = new EthjsAddress(Buffer.from('1234567890123456789012345678901234567890', 'hex'))
		const existingAccount = new EthjsAccount()
		existingAccount.balance = initialBalance

		// Mock EVM
		const mockEvm = {
			stateManager: {
				getAccount: vi.fn().mockResolvedValue(existingAccount),
			},
			journal: {
				putAccount: vi.fn().mockResolvedValue(undefined),
			},
		}

		// Call the function
		const reward = 50n
		const result = await rewardAccount(mockEvm as any, address, reward)

		// Verify
		expect(mockEvm.stateManager.getAccount).toHaveBeenCalledWith(address)
		expect(mockEvm.journal.putAccount).toHaveBeenCalledWith(address, result)
		expect(result.balance).toBe(initialBalance + reward)
		expect(result.balance).toBe(150n)
	})

	it('should create a new account if it does not exist', async () => {
		// Setup
		const address = new EthjsAddress(Buffer.from('1234567890123456789012345678901234567890', 'hex'))

		// Mock EVM
		const mockEvm = {
			stateManager: {
				getAccount: vi.fn().mockResolvedValue(undefined),
			},
			journal: {
				putAccount: vi.fn().mockResolvedValue(undefined),
			},
		}

		// Call the function
		const reward = 100n
		const result = await rewardAccount(mockEvm as any, address, reward)

		// Verify
		expect(mockEvm.stateManager.getAccount).toHaveBeenCalledWith(address)
		expect(mockEvm.journal.putAccount).toHaveBeenCalledWith(address, result)
		expect(result.balance).toBe(reward)
		expect(result.balance).toBe(100n)
		expect(result).toBeInstanceOf(EthjsAccount)
	})
})
