import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'

describe('eth_getUncleByBlockNumberAndIndex', () => {
	const client = getTestClient()

	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleByBlockNumberAndIndex',
			params: [BLOCK_NUMBER, '0x0'],
		})
		await client.flush()

		assertMethodCached('eth_getUncleByBlockNumberAndIndex', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleByBlockNumberAndIndex',
			params: ['latest', '0x0'],
		})
		await client.flush()

		assertMethodNotCached('eth_getUncleByBlockNumberAndIndex', (params) => params[0] === 'latest')
	})
})
