import { describe, it } from 'vitest'
import { assertMethodCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_supportedEntryPoints', () => {
	it('should create a cache entry', async () => {
		// This method might not be implemented
		try {
			await client.tevm.transport.tevm.forkTransport?.request({
				method: 'eth_supportedEntryPoints',
				params: [],
			})
		} catch (error) {}

		assertMethodCached('eth_supportedEntryPoints')
	})
})
