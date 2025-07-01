import { describe, it } from 'vitest'
import { BLOCK_HASH } from '../constants.js'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getUncleByBlockHashAndIndex', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleByBlockHashAndIndex',
			params: [BLOCK_HASH, '0x0'],
		})

		await client.save()
		assertMethodCached('eth_getUncleByBlockHashAndIndex')
	})
})
