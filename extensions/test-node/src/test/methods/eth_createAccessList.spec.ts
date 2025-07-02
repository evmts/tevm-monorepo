import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

const EF = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'

describe('eth_createAccessList', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_createAccessList',
			params: [
				{
					from: EF,
					to: PREFUNDED_ACCOUNTS[1].address,
					data: '0x',
				},
				BLOCK_NUMBER,
			],
		})

		await client.saveSnapshots()
		assertMethodCached('eth_createAccessList', (params) => params[3] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_createAccessList',
			params: [
				{
					from: EF,
					to: PREFUNDED_ACCOUNTS[1].address,
					data: '0x',
				},
				'latest',
			],
		})

		await client.saveSnapshots()
		assertMethodNotCached('eth_createAccessList', (params) => params[3] === 'latest')
	})
})
