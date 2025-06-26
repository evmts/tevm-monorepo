import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'

const EF = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'

describe('eth_createAccessList', () => {
	const client = getTestClient()

	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
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
		await client.flush()

		assertMethodCached('eth_createAccessList', (params) => params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
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
		await client.flush()

		assertMethodNotCached('eth_createAccessList', (params) => params[1] === 'latest')
	})
})
