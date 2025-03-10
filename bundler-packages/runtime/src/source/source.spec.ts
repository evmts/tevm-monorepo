import { describe, expect, it, vi } from 'vitest'
import { WagmiReads } from '../../source.js'

// Mock dependencies
vi.mock('wagmi', () => ({
	useAccount: vi.fn(() => ({ address: '0xAddress', isConnected: true })),
	useContractRead: vi.fn(({ enabled }) => ({ data: enabled ? BigInt(100) : undefined })),
}))

vi.mock('./TestContract.js', () => ({
	TestContract: {
		read: () => ({
			balanceOf: () => ({
				abi: [],
				address: '0xTestContract',
				args: ['0xAddress'],
			}),
			totalSupply: () => ({
				abi: [],
				address: '0xTestContract',
				args: [],
			}),
			symbol: () => ({
				abi: [],
				address: '0xTestContract',
				args: [],
			}),
		}),
	},
}))

describe('WagmiReads', () => {
	it('should return contract data when connected', () => {
		const result = WagmiReads()

		expect(result).toEqual({
			testBalance: BigInt(100),
			symbol: BigInt(100),
			totalSupply: BigInt(100),
		})
	})
})
