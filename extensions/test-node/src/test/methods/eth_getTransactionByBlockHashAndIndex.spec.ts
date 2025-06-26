import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_HASH } from '../constants.js'
import { assertMethodCached } from '../utils.js'

describe('eth_getTransactionByBlockHashAndIndex', () => {
	const client = getTestClient()

	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByBlockHashAndIndex',
			params: [BLOCK_HASH, '0x0'],
		})
		await client.flush()

		assertMethodCached('eth_getTransactionByBlockHashAndIndex')
	})
})
