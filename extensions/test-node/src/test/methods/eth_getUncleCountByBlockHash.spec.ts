import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_HASH } from '../constants.js'
import { assertMethodCached } from '../utils.js'

describe('eth_getUncleCountByBlockHash', () => {
	const client = getTestClient()

	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleCountByBlockHash',
			params: [BLOCK_HASH],
		})
		await client.flush()

		assertMethodCached('eth_getUncleCountByBlockHash')
	})
})
