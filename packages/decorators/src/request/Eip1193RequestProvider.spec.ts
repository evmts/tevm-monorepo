import type { Hex } from '@tevm/utils'
import { describe, it, vi } from 'vitest'
import type { Eip1193RequestProvider } from './Eip1193RequestProvider.js'

describe('Eip1193RequestProvider types', () => {
	it('should create a typesafe request function', async () => {
		const client = {
			request: vi.fn().mockResolvedValue({}),
		} as Eip1193RequestProvider

		// eth_blockNumber
		const blockNumberRes = await client.request({
			method: 'eth_blockNumber',
		})
		blockNumberRes satisfies Hex

		// eth_call
		const callRes = await client.request({
			method: 'eth_call',
			params: [
				{
					to: '0x123',
					data: '0x123',
				},
			],
		})
		callRes satisfies Hex

		// tevm_getAccount
		const accountRes = await client.request({
			method: 'tevm_getAccount',
			params: [
				{
					address: '0x123',
				},
			],
		})
		accountRes.balance satisfies Hex
	})
})
