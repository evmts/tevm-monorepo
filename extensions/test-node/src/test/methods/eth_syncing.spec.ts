import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodNotCached } from '../utils.js'

describe('eth_syncing', () => {
	const client = getTestClient()

	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_syncing', params: [] })
		await client.flush()

		assertMethodNotCached('eth_syncing')
	})
})
