import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { TRANSACTION_HASH } from '../constants.js'
import { assertMethodCached } from '../utils.js'

describe('eth_getTransactionByHash', () => {
	const client = getTestClient()

	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByHash',
			params: [TRANSACTION_HASH],
		})
		await client.flush()

		assertMethodCached('eth_getTransactionByHash')
	})
})
