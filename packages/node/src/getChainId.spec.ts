import { describe, expect, it, vi } from 'vitest'
import { getChainId } from './getChainId.js'

describe('getChainId', () => {
	it('should return the chain id when successful', async () => {
		const chainId = await getChainId({
			request: vi.fn().mockResolvedValue('0x1'),
		})
		expect(chainId).toBe(1)
	})

	it('should handle transport function to cover line 8', async () => {
		const transportFn = () => ({
			request: vi.fn().mockResolvedValue('0xa'),
		})
		const chainId = await getChainId(transportFn)
		expect(chainId).toBe(10)
	})

	it('should throw an error when there is an error or chainId is undefined', async () => {
		await expect(
			getChainId({
				request: vi.fn().mockRejectedValue(new Error('chain id unavailable')),
			}),
		).rejects.toThrowError('chain id unavailable')
	})
})
