import type { Hex } from '@tevm/utils'
import { describe, it, vi } from 'vitest'
import type { Eip1193RequestProvider } from './Eip1193RequestProvider.js'

describe('Eip1193RequestProvider types', () => {
	it('should create a typesafe request function', async () => {
		const client = {
			request: vi.fn().mockResolvedValue({}),
		} as Eip1193RequestProvider

		// tevm_getAccount - typed method in the schema
		const accountRes = await client.request({
			method: 'tevm_getAccount',
			params: [
				{
					address: '0x0000000000000000000000000000000000000123',
				},
			],
		})
		accountRes.balance satisfies Hex

		// tevm_call - typed method in the schema
		const callRes = await client.request({
			method: 'tevm_call',
			params: [
				{
					to: '0x0000000000000000000000000000000000000123',
					data: '0x1234',
				},
			],
		})
		callRes.rawData satisfies Hex
	})
})
