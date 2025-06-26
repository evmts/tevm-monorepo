import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { USER_OPERATION_HASH } from '../constants.js'
import { assertMethodCached } from '../utils.js'

describe.todo('eth_getUserOperationReceipt', () => {
	const client = getTestClient()

	// TODO: weirdly not available with any provider
	it.todo('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUserOperationReceipt',
			params: [USER_OPERATION_HASH],
		})
		await client.flush()

		assertMethodCached('eth_getUserOperationReceipt')
	})
})
