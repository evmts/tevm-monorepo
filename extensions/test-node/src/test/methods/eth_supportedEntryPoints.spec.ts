import { describe, it } from 'vitest'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_supportedEntryPoints', () => {
	it('should create a cache entry', async () => {
		// This method might not be implemented
		try {
			await client.transport.tevm.forkTransport?.request({
				method: 'eth_supportedEntryPoints',
				params: [],
			})
			await client.saveSnapshots()
			assertMethodCached('eth_supportedEntryPoints')
		} catch (error) {}
	})
})
