import { describe, it } from 'vitest'
import { BLOCK_HASH } from '../constants.js'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getBlockTransactionCountByHash', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getBlockTransactionCountByHash',
			params: [BLOCK_HASH],
		})

		await client.save()
		assertMethodCached('eth_getBlockTransactionCountByHash')
	})
})
