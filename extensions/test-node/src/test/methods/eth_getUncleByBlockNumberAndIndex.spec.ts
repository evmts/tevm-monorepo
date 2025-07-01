import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getUncleByBlockNumberAndIndex', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleByBlockNumberAndIndex',
			params: [BLOCK_NUMBER, '0x0'],
		})

		await client.save()
		assertMethodCached('eth_getUncleByBlockNumberAndIndex', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleByBlockNumberAndIndex',
			params: ['latest', '0x0'],
		})

		await client.save()
		assertMethodNotCached('eth_getUncleByBlockNumberAndIndex', (params) => params[0] === 'latest')
	})
})
