import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_newPendingTransactionFilter', () => {
	it('should NOT create a cache entry', async () => {
		// This method might not be implemented
		try {
			await client.transport.tevm.forkTransport?.request({ method: 'eth_newPendingTransactionFilter' })
		} catch (error) {}

		await client.saveSnapshots()
		assertMethodNotCached('eth_newPendingTransactionFilter')
	})
})
