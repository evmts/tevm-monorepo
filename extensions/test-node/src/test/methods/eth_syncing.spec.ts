import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_syncing', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_syncing', params: [] })
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_syncing'), 'eth_syncing should NOT be cached')
	})
})
