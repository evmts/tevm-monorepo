import { assert, describe, it } from 'vitest'
import { client, TRANSACTION_HASH } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getTransactionReceipt', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionReceipt',
			params: [TRANSACTION_HASH],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getTransactionReceipt'), 'eth_getTransactionReceipt should be cached')
	})
})
