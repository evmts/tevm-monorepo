import { assert, describe, it } from 'vitest'
import { client, USER_OPERATION_HASH } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getUserOperationReceipt', () => {
	// TODO: weirdly not available with any provider
	it.todo('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUserOperationReceipt',
			params: [USER_OPERATION_HASH],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getUserOperationReceipt'), 'eth_getUserOperationReceipt should be cached')
	})
})
