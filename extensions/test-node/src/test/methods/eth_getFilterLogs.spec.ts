import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getFilterLogs', () => {
	// TODO: we need to get a filter somewhere or create an actual filter on the forked node
	it.todo('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_getFilterLogs', params: ['0x1'] })
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getFilterLogs'), 'eth_getFilterLogs should NOT be cached')
	})
})
