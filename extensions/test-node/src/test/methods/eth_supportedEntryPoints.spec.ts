import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodCached } from '../utils.js'

describe('eth_supportedEntryPoints', () => {
	const client = getTestClient()

	it('should create a cache entry', async () => {
		// This method might not be implemented
		try {
			await client.tevm.transport.tevm.forkTransport?.request({
				method: 'eth_supportedEntryPoints',
				params: [],
			})
		} catch (error) {}
		await client.flush()

		assertMethodCached('eth_supportedEntryPoints')
	})
})
