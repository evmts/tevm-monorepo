import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_coinbase', () => {
	it('should create a cache entry', async () => {
		// This will fail as eth_coinbase is restricted by blockchain schema but we're interested in it getting cached or not
		// some rpcs will throw (e.g. with ankr) and some will not (e.g. with quicknode)
		try {
			const res = await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_coinbase' })
			console.log({res})
		} catch (error) {
		}
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_coinbase'), 'eth_coinbase should be cached')
	})
})
