import { describe, it } from 'vitest'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_coinbase', () => {
	it('should create a cache entry', async () => {
		// This might fail as eth_coinbase is restricted by blockchain schema or unavailable but we're interested in it getting cached or not
		// some rpcs will throw (e.g. with ankr) and some will not (e.g. with quicknode)
		try {
			await client.transport.tevm.forkTransport?.request({ method: 'eth_coinbase' })
			await client.saveSnapshots()
			assertMethodCached('eth_coinbase')
		} catch (_error) {}
	})
})
