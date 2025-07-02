import { describe, it } from 'vitest'
import { TRANSACTION_HASH } from '../constants.js'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getTransactionByHash', () => {
	it('should create a cache entry', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByHash',
			params: [TRANSACTION_HASH],
		})

		await client.saveSnapshots()
		assertMethodCached('eth_getTransactionByHash')
	})
})
