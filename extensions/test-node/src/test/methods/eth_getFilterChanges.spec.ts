import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getFilterChanges', () => {
	// TODO: we need to get a filter somewhere or create an actual filter on the forked node
	it.todo('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_getFilterChanges', params: ['0x1'] })
		assertMethodNotCached('eth_getFilterChanges')
	})
})
