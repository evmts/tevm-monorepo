import { describe, it } from 'vitest'
import { TRANSACTION_HASH } from '../constants.js'
import { assertMethodCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getTransactionReceipt', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionReceipt',
			params: [TRANSACTION_HASH],
		})

		assertMethodCached('eth_getTransactionReceipt')
	})
})
