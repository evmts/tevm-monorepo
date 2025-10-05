import { createTevmNode, type TevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('ethFeeHistoryProcedure', () => {
	it('should return fee history for a range of blocks with basic parameters', async () => {
		// This test will fail initially - that's the TDD approach
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_feeHistory' as const,
			id: 1,
			params: ['0x4' as const, 'latest' as const] as const, // 4 blocks, latest
		}

		// Import will fail initially since we haven't created the procedure yet
		const { ethFeeHistoryProcedure } = await import('./ethFeeHistoryProcedure.js')
		
		const response = await ethFeeHistoryProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_feeHistory')
		expect(response.id).toBe(request.id)
		
		// Verify the structure of the result
		expect(response.result).toHaveProperty('baseFeePerGas')
		expect(response.result).toHaveProperty('gasUsedRatio')
		expect(Array.isArray(response.result.baseFeePerGas)).toBe(true)
		expect(Array.isArray(response.result.gasUsedRatio)).toBe(true)
		
		// Should return exactly the number of blocks requested
		expect(response.result.baseFeePerGas.length).toBe(5) // blockCount + 1 (for next block prediction)
		expect(response.result.gasUsedRatio.length).toBe(4) // blockCount
	})

	it('should return fee history with reward percentiles', async () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_feeHistory' as const,
			id: 2,
			params: ['0x2' as const, 'latest' as const, [25, 50, 75] as const],
		}

		const { ethFeeHistoryProcedure } = await import('./ethFeeHistoryProcedure.js')
		
		const response = await ethFeeHistoryProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		
		// Should include reward percentiles
		expect(response.result).toHaveProperty('reward')
		expect(Array.isArray(response.result.reward)).toBe(true)
		expect(response.result.reward.length).toBe(2) // blockCount
		
		// Each block should have 3 percentile values (25th, 50th, 75th)
		response.result.reward.forEach((blockRewards: any) => {
			expect(Array.isArray(blockRewards)).toBe(true)
			expect(blockRewards.length).toBe(3)
		})
	})

	it('should handle requests without an id', async () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_feeHistory' as const,
			params: ['0x1' as const, 'latest' as const],
		}

		const { ethFeeHistoryProcedure } = await import('./ethFeeHistoryProcedure.js')
		
		const response = await ethFeeHistoryProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_feeHistory')
		expect(response.id).toBeUndefined()
	})

	it('should handle specific block numbers instead of "latest"', async () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_feeHistory' as const,
			id: 3,
			params: ['0x3' as const, '0x10' as const], // 3 blocks ending at block 16
		}

		const { ethFeeHistoryProcedure } = await import('./ethFeeHistoryProcedure.js')
		
		const response = await ethFeeHistoryProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.result.baseFeePerGas.length).toBe(4) // blockCount + 1
		expect(response.result.gasUsedRatio.length).toBe(3) // blockCount
	})

	it('should handle edge cases with zero block count', async () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_feeHistory' as const,
			id: 4,
			params: ['0x0' as const, 'latest' as const],
		}

		const { ethFeeHistoryProcedure } = await import('./ethFeeHistoryProcedure.js')
		
		const response = await ethFeeHistoryProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.result.baseFeePerGas.length).toBe(1) // Just the next block's base fee
		expect(response.result.gasUsedRatio.length).toBe(0) // No historical blocks
	})

	it('should validate block count parameter bounds', async () => {
		// Test maximum block count (should be around 1024)
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_feeHistory' as const,
			id: 5,
			params: ['0x401' as const, 'latest' as const], // 1025 blocks (over limit)
		}

		const { ethFeeHistoryProcedure } = await import('./ethFeeHistoryProcedure.js')
		
		const response = await ethFeeHistoryProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		// Should either error or cap at maximum
		if (response.error) {
			expect(response.error.message).toContain('block count')
		} else {
			// If it doesn't error, it should cap at reasonable limit
			expect(response.result.gasUsedRatio.length).toBeLessThanOrEqual(1024)
		}
	})

	it('should return proper hex-encoded values', async () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_feeHistory' as const,
			id: 6,
			params: ['0x1' as const, 'latest' as const, [50] as const],
		}

		const { ethFeeHistoryProcedure } = await import('./ethFeeHistoryProcedure.js')
		
		const response = await ethFeeHistoryProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		
		// All baseFeePerGas values should be hex strings
		response.result.baseFeePerGas.forEach((fee: any) => {
			expect(typeof fee).toBe('string')
			expect(fee).toMatch(/^0x[0-9a-fA-F]+$/)
		})

		// All reward values should be hex strings
		if (response.result.reward) {
			response.result.reward.forEach((blockRewards: any) => {
				blockRewards.forEach((reward: any) => {
					expect(typeof reward).toBe('string')
					expect(reward).toMatch(/^0x[0-9a-fA-F]+$/)
				})
			})
		}

		// gasUsedRatio should be numbers between 0 and 1
		response.result.gasUsedRatio.forEach((ratio: any) => {
			expect(typeof ratio).toBe('number')
			expect(ratio).toBeGreaterThanOrEqual(0)
			expect(ratio).toBeLessThanOrEqual(1)
		})
	})
})