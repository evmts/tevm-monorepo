import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

const EF = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'

describe('eth_estimateGas', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_estimateGas',
			params: [
				{
					from: EF,
					to: PREFUNDED_ACCOUNTS[1].address,
					data: '0x',
				},
				BLOCK_NUMBER,
			],
		})

		assertMethodCached('eth_estimateGas', (params) => params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_estimateGas',
			params: [
				{
					from: EF,
					to: PREFUNDED_ACCOUNTS[1].address,
					data: '0x',
				},
				'latest',
			],
		})

		assertMethodNotCached('eth_estimateGas', (params) => params[1] === 'latest')
	})
})
