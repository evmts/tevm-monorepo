import { describe, it } from 'vitest'
import { assertMethodCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_coinbase', () => {
	it('should create a cache entry', async () => {
		// This will fail as eth_coinbase is restricted by blockchain schema but we're interested in it getting cached or not
		// some rpcs will throw (e.g. with ankr) and some will not (e.g. with quicknode)
		try {
			const res = await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_coinbase' })
			console.log({ res })
		} catch (error) {}

		assertMethodCached('eth_coinbase')
	})
})
