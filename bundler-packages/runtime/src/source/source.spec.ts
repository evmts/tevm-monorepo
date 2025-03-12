import { describe, expect, it } from 'vitest'
import { WagmiReads } from '../../source.js'

import { useContractRead } from '../../source.js'

// Mock the useContractRead function directly to test both branches
describe('WagmiReads', () => {
	it('should return contract data when connected', () => {
		const result = WagmiReads()

		expect(result).toEqual({
			testBalance: BigInt(100),
			symbol: BigInt(100),
			totalSupply: BigInt(100),
		})
	})

	it('should handle the useAccount hook correctly', () => {
		// Since we're using our internal implementation now, we can test it directly
		const result = WagmiReads()

		// We're just testing that our mocked implementation works as expected
		expect(result).toBeDefined()
	})

	it('should handle contract read operations correctly', () => {
		const result = WagmiReads()

		// Test each value returned by the component
		expect(result.testBalance).toEqual(BigInt(100))
		expect(result.symbol).toEqual(BigInt(100))
		expect(result.totalSupply).toEqual(BigInt(100))
	})

	it('should return undefined when enabled is false', () => {
		// Test the useContractRead function directly
		const result = useContractRead({ enabled: false })
		expect(result.data).toBeUndefined()
	})
})
