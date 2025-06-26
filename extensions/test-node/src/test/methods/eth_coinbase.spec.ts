import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodCached } from '../utils.js'

describe('eth_coinbase', () => {
	const client = getTestClient()

	it('should create a cache entry', async () => {
		// This will fail as eth_coinbase is restricted by blockchain schema but we're interested in it getting cached or not
		// some rpcs will throw (e.g. with ankr) and some will not (e.g. with quicknode)
		try {
			const res = await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_coinbase' })
			console.log({ res })
		} catch (error) {}
		await client.flush()

		assertMethodCached('eth_coinbase')
	})
})
