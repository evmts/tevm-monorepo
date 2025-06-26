import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'

describe('eth_getUncleCountByBlockNumber', () => {
	const client = getTestClient()

	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleCountByBlockNumber',
			params: [BLOCK_NUMBER],
		})
		await client.flush()

		assertMethodCached('eth_getUncleCountByBlockNumber', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleCountByBlockNumber',
			params: ['latest'],
		})
		await client.flush()

		assertMethodNotCached('eth_getUncleCountByBlockNumber', (params) => params[0] === 'latest')
	})
})
