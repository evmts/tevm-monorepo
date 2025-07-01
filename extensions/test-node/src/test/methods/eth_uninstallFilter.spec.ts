import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe.todo('eth_uninstallFilter', () => {
	// TODO: we need to get a filter somewhere or create an actual filter on the forked node first
	it.todo('should NOT create a cache entry', async () => {
		await client.tevm.request({ method: 'eth_uninstallFilter', params: ['0x1'] })
		assertMethodNotCached('eth_uninstallFilter')
	})
})
