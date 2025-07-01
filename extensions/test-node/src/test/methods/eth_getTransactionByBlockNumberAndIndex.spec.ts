import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getTransactionByBlockNumberAndIndex', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByBlockNumberAndIndex',
			params: [BLOCK_NUMBER, '0x0'],
		})

		assertMethodCached('eth_getTransactionByBlockNumberAndIndex', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByBlockNumberAndIndex',
			params: ['latest', '0x0'],
		})

		assertMethodNotCached('eth_getTransactionByBlockNumberAndIndex', (params) => params[0] === 'latest')
	})
})
