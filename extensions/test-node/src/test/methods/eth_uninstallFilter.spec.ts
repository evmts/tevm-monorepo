import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodNotCached } from '../utils.js'

describe.todo('eth_uninstallFilter', () => {
	const client = getTestClient()

	// TODO: we need to get a filter somewhere or create an actual filter on the forked node first
	it.todo('should NOT create a cache entry', async () => {
		await client.tevm.request({ method: 'eth_uninstallFilter', params: ['0x1'] })
		await client.flush()

		assertMethodNotCached('eth_uninstallFilter')
	})
})
