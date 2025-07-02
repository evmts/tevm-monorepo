import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getCode', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getCode',
			params: [PREFUNDED_ACCOUNTS[0].address, BLOCK_NUMBER],
		})

		await client.saveSnapshots()
		assertMethodCached('eth_getCode', (params) => params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getCode',
			params: [PREFUNDED_ACCOUNTS[0].address, 'latest'],
		})

		await client.saveSnapshots()
		assertMethodNotCached('eth_getCode', (params) => params[1] === 'latest')
	})
})
