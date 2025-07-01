import { describe, it } from 'vitest'
import { TRANSACTION_HASH } from '../constants.js'
import { assertMethodCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getTransactionByHash', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByHash',
			params: [TRANSACTION_HASH],
		})

		assertMethodCached('eth_getTransactionByHash')
	})
})
