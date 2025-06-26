import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_protocolVersion', () => {
	it('should create a cache entry', async () => {
		// protocolVersion returns a constant so we use the fork transport to test caching
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_protocolVersion' })
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_protocolVersion'), 'eth_protocolVersion should be cached')
	})
})
