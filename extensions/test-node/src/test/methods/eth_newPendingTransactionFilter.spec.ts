import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodNotCached } from '../utils.js'

describe('eth_newPendingTransactionFilter', () => {
	const client = getTestClient()

	it('should NOT create a cache entry', async () => {
		// This method might not be implemented
		try {
			await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_newPendingTransactionFilter' })
		} catch (error) {}
		await client.flush()

		assertMethodNotCached('eth_newPendingTransactionFilter')
	})
})
