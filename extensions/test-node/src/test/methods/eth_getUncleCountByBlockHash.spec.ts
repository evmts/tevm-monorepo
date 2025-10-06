import { describe, it } from 'vitest'
import { BLOCK_HASH } from '../constants.js'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getUncleCountByBlockHash', () => {
	it('should create a cache entry', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleCountByBlockHash',
			params: [BLOCK_HASH],
		})

		await client.saveSnapshots()
		assertMethodCached('eth_getUncleCountByBlockHash')
	})
})
