import { describe, expect, it, vi } from 'vitest'
import { Evm } from './Evm.js'
import { createEvm } from './createEvm.js'

// This test is primarily checking that the types and interfaces match correctly
describe('createEvm', () => {
	it('should be defined', () => {
		expect(createEvm).toBeDefined()
	})

	it('should return a properly shaped EVM object', async () => {
		// Mock implementation to avoid actual WASM loading in tests
		const mockEvm = {
			ready: async () => {},
			addCustomPrecompile: async () => {},
			removeCustomPrecompile: async () => {},
			runCall: async () => ({ result: '0x', gasUsed: 0n, logs: [] }),
			setAccount: async () => {},
			getAccount: async () => ({ balance: 0n, nonce: 0, codeHash: '0x', code: null }),
		}

		// Mock the static create method
		vi.spyOn(Evm, 'create').mockImplementation(async () => mockEvm as any)

		// Test the createEvm function
		const evm = await createEvm({
			common: {} as any,
			stateManager: {} as any,
			blockchain: {} as any,
		})

		// Check that the returned object has the expected methods
		expect(evm).toBeDefined()
		expect(typeof evm.ready).toBe('function')
		expect(typeof evm.addCustomPrecompile).toBe('function')
		expect(typeof evm.removeCustomPrecompile).toBe('function')
		expect(typeof evm.runCall).toBe('function')

		// Reset mocks
		vi.restoreAllMocks()
	})
})
