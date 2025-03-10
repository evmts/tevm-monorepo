import { describe, expect, it, jest } from 'bun:test'
import { EthjsAddress, parseGwei } from '@tevm/utils'
import { assignWithdrawals } from './assignWithdrawals.js'

describe('assignWithdrawals', () => {
	it('creates a function that processes withdrawals', () => {
		// Setup mock VM
		const mockVm = {
			evm: {},
		}

		// Call the function
		const processWithdrawals = assignWithdrawals(mockVm as any)

		// Verify it returns a function
		expect(typeof processWithdrawals).toBe('function')
	})
})
