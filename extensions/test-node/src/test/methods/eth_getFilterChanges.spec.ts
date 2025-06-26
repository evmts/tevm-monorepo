import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodNotCached } from '../utils.js'

describe('eth_getFilterChanges', () => {
	const client = getTestClient()

	// TODO: we need to get a filter somewhere or create an actual filter on the forked node
	it.todo('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_getFilterChanges', params: ['0x1'] })
		await client.flush()

		assertMethodNotCached('eth_getFilterChanges')
	})
})
