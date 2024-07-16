import type { Hex } from 'viem'
import { describe, it, vi } from 'vitest'
import type { Eip1193RequestProvider } from './Eip1193RequestProvider.js'

describe('Eip1193RequestProvider types', () => {
	it('should create a typesafe request function', async () => {
		const client = {
			request: vi.fn().mockResolvedValue({}),
		} as Eip1193RequestProvider

		// tevm_script
		const scriptRes = await client.request({
			method: 'tevm_script',
			params: [
				{
					data: '0x99999',
					deployedBytecode: '0x99999',
				},
			],
		})
		scriptRes.gas satisfies Hex | undefined
		scriptRes.rawData satisfies Hex

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
