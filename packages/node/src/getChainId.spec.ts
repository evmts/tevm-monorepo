import { http } from '@tevm/jsonrpc'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { getChainId } from './getChainId.js'

describe('getChainId', () => {
	it('should return the chain id when successful', async () => {
		const chainId = await getChainId(transports.mainnet)
		expect(chainId).toBe(1)
	})

	it('should handle transport function to cover line 8', async () => {
		// Test with a transport function instead of a transport object
		const transportFn = http('https://mainnet.optimism.io')
		const chainId = await getChainId(transportFn)
		expect(typeof chainId).toBe('number')
	})

	it('should throw an error when there is an error or chainId is undefined', async () => {
		const url = 'https://typo.mainnet.optimism.io'
		await expect(getChainId(http(url)({}))).rejects.toThrowError()
	})
})
