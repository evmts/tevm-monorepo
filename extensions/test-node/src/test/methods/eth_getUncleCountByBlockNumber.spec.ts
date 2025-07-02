import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getUncleCountByBlockNumber', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleCountByBlockNumber',
			params: [BLOCK_NUMBER],
		})

		await client.saveSnapshots()
		assertMethodCached('eth_getUncleCountByBlockNumber', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleCountByBlockNumber',
			params: ['latest'],
		})

		await client.saveSnapshots()
		assertMethodNotCached('eth_getUncleCountByBlockNumber', (params) => params[0] === 'latest')
	})
})
