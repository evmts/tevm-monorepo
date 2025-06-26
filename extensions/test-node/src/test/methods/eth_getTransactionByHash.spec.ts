import { assert, describe, it } from 'vitest'
import { client, TRANSACTION_HASH } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getTransactionByHash', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByHash',
			params: [TRANSACTION_HASH],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getTransactionByHash'), 'eth_getTransactionByHash should be cached')
	})
})
