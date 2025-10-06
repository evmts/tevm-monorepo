import { describe, it } from 'vitest'
import { USER_OPERATION_HASH } from '../constants.js'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe.todo('eth_getUserOperationByHash', () => {
	// TODO: weirdly not available with any provider
	it.todo('should create a cache entry', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getUserOperationByHash',
			params: [USER_OPERATION_HASH],
		})

		await client.saveSnapshots()
		assertMethodCached('eth_getUserOperationByHash')
	})
})
