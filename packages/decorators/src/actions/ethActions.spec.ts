import { describe, expect, it, vi } from 'vitest'
import { ethActions } from './ethActions.js'

// Mock the dynamic imports instead of the module itself
vi.mock('./ethActions.js', async (importOriginal) => {
	const actual = await importOriginal()

	const createMockHandler = (name: string) => {
		return vi.fn().mockImplementation(() => {
			return function mockHandler() {
				return `${name} result`
			}
		})
	}

	// Create mock for the dynamic import function
	const mockImportEthHandlers = vi.fn().mockResolvedValue({
		blockNumberHandler: createMockHandler('blockNumber'),
		ethCallHandler: createMockHandler('ethCall'),
		chainIdHandler: createMockHandler('chainId'),
		gasPriceHandler: createMockHandler('gasPrice'),
		getBalanceHandler: createMockHandler('getBalance'),
		getCodeHandler: createMockHandler('getCode'),
		getStorageAtHandler: createMockHandler('getStorageAt'),
	})

	// Return the original module with our mock
	return {
		...actual,
		importEthHandlers: mockImportEthHandlers,
	}
})

describe('ethActions', () => {
	it('should add eth methods to client', () => {
		// Create client with no eth property
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		const extended = ethActions()(mockClient)

		// Check that the eth object exists with all expected methods
		expect(extended).toHaveProperty('eth')
		expect(extended.eth).toHaveProperty('blockNumber')
		expect(extended.eth).toHaveProperty('call')
		expect(extended.eth).toHaveProperty('chainId')
		expect(extended.eth).toHaveProperty('gasPrice')
		expect(extended.eth).toHaveProperty('getBalance')
		expect(extended.eth).toHaveProperty('getCode')
		expect(extended.eth).toHaveProperty('getStorageAt')

		// Verify that the methods return expected values
		expect(extended.eth.blockNumber()).toBe('blockNumber result')
		expect(extended.eth.call({ to: '0x123' } as any)).toBe('ethCall result')
	})

	it('should preserve existing eth properties', () => {
		const mockClient = {
			eth: {
				existingProperty: 'should remain',
				getExistingMethod: () => 'should remain',
			},
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		const extended = ethActions()(mockClient)

		// Check that existing properties are preserved
		expect((extended.eth as any).existingProperty).toBe('should remain')
		expect(typeof (extended.eth as any).getExistingMethod).toBe('function')
		expect((extended.eth as any).getExistingMethod()).toBe('should remain')

		// And new methods are added
		expect(extended.eth).toHaveProperty('blockNumber')
		expect(extended.eth).toHaveProperty('call')

		// Verify that the methods return expected values
		expect(extended.eth.blockNumber()).toBe('blockNumber result')
	})

	it('should throw error if eth exists but is not an object', () => {
		const mockClient = {
			eth: 'not an object',
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		expect(() => ethActions()(mockClient)).toThrow(
			'Cannot extend eth with ethActions decorator. detected a client.eth property that is not an object',
		)
	})
})
