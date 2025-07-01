import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getBlockTransactionCountByNumber', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getBlockTransactionCountByNumber',
			params: [BLOCK_NUMBER],
		})

		await client.save()
		assertMethodCached('eth_getBlockTransactionCountByNumber', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getBlockTransactionCountByNumber',
			params: ['latest'],
		})

		await client.save()
		assertMethodNotCached('eth_getBlockTransactionCountByNumber', (params) => params[0] === 'latest')
	})
})
