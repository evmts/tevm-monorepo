import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as WagmiModule from 'wagmi'
import { WagmiReads } from './source'

// Create mocks for all dependencies
vi.mock('wagmi', () => ({
	useAccount: vi.fn(),
	useContractRead: vi.fn(),
}))

vi.mock('./TestContract.js', () => ({
	TestContract: {
		read: vi.fn().mockReturnValue({
			balanceOf: vi.fn().mockReturnValue({ abi: [], address: '0x123', args: ['0x123'] }),
			totalSupply: vi.fn().mockReturnValue({ abi: [], address: '0x123', args: [] }),
			symbol: vi.fn().mockReturnValue({ abi: [], address: '0x123', args: [] }),
		}),
	},
}))

describe('WagmiReads', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return contract data when connected', () => {
		vi.mocked(WagmiModule.useAccount).mockReturnValue({
			address: '0x123' as any,
			isConnected: true,
			connector: undefined as any,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
		})

		vi.mocked(WagmiModule.useContractRead)
			.mockReturnValueOnce({ data: 1000n, isLoading: false, isSuccess: true } as any)
			.mockReturnValueOnce({ data: 1000000n, isLoading: false, isSuccess: true } as any)
			.mockReturnValueOnce({ data: 'TEST', isLoading: false, isSuccess: true } as any)

		const result = WagmiReads()

		expect(result).toEqual({
			testBalance: 1000n,
			symbol: 'TEST',
			totalSupply: 1000000n,
		})
	})

	it('should return undefined data when not connected', () => {
		vi.mocked(WagmiModule.useAccount).mockReturnValue({
			address: undefined,
			isConnected: false,
			connector: undefined as any,
			isConnecting: false,
			isDisconnected: true,
			isReconnecting: false,
			status: 'disconnected',
		})

		vi.mocked(WagmiModule.useContractRead)
			.mockReturnValueOnce({ data: undefined, isLoading: false, isSuccess: false } as any)
			.mockReturnValueOnce({ data: undefined, isLoading: false, isSuccess: false } as any)
			.mockReturnValueOnce({ data: undefined, isLoading: false, isSuccess: false } as any)

		const result = WagmiReads()

		expect(result).toEqual({
			testBalance: undefined,
			symbol: undefined,
			totalSupply: undefined,
		})
	})

	// Additional test to cover all lines
	it('should correctly infer types for testBalance, testSymbol, testTotalSupply', () => {
		vi.mocked(WagmiModule.useAccount).mockReturnValue({
			address: '0x123' as any,
			isConnected: true,
			connector: undefined as any,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
		})

		vi.mocked(WagmiModule.useContractRead)
			.mockReturnValueOnce({ data: 1000n, isLoading: false, isSuccess: true } as any)
			.mockReturnValueOnce({ data: 1000000n, isLoading: false, isSuccess: true } as any)
			.mockReturnValueOnce({ data: 'TEST', isLoading: false, isSuccess: true } as any)

		const result = WagmiReads()

		// Check that the type inference works correctly (runtime test, but it ensures the code is called)
		expect(typeof result.testBalance).toBe('bigint')
		expect(typeof result.symbol).toBe('string')
		expect(typeof result.totalSupply).toBe('bigint')
	})
})
