import { describe, expect, it } from 'vitest'
import { getChainId } from './getChainId.js'

describe('getChainId', () => {
	it('should return the chain id when successful', async () => {
		const chainId = await getChainId({
			request: async () => '0x1',
		})
		expect(chainId).toBe(1)
	})

	it('should handle transport function to cover line 8', async () => {
		const transportFn = () => ({
			request: async () => '0xa',
		})
		const chainId = await getChainId(transportFn)
		expect(chainId).toBe(10)
	})

	it('should throw an error when there is an error or chainId is undefined', async () => {
		await expect(
			getChainId({
				request: async () => {
					throw { code: -32000, message: 'boom' }
				},
			}),
		).rejects.toBeDefined()
	})
})
