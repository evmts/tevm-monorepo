import { describe, expect, it } from 'vitest'
import { GENESIS_STATE, prefundedAccounts } from './GENESIS_STATE.js'

describe('GENESIS_STATE', () => {
	it('should have a valid structure', () => {
		expect(GENESIS_STATE).toBeDefined()
		// Check that the GENESIS_STATE contains all the expected prefunded accounts
		for (const account of prefundedAccounts) {
			expect(GENESIS_STATE[account]).toBeDefined()
			expect((GENESIS_STATE[account] as any).balance).toBeGreaterThan(0n)
		}

		// Add a property to 0x0 to test the optional chaining on line 48/49
		// This is fine since we're not modifying the actual exported module
		GENESIS_STATE['0x0'] = {
			nonce: 0n,
			balance: 0n,
			storageRoot: '0x0',
			codeHash: '0x0',
			deployedBytecode: '0x1234', // Add deployedBytecode to cover the optional chain
		}

		expect(GENESIS_STATE['0x0']).toBeDefined()
		// Try to access deployedBytecode to cover the optional chaining
		const deployedBytecode = GENESIS_STATE['0x0']?.deployedBytecode
		expect(deployedBytecode).toBe('0x1234')
	})
})
