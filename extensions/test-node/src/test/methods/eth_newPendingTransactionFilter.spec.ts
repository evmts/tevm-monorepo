import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_newPendingTransactionFilter', () => {
	it('should NOT create a cache entry', async () => {
		// This method might not be implemented
		try {
			await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_newPendingTransactionFilter' })
		} catch (error) {
		}
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_newPendingTransactionFilter'), 'eth_newPendingTransactionFilter should NOT be cached')
	})
})
