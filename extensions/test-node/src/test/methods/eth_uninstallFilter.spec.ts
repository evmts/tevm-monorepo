import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_uninstallFilter', () => {
	// TODO: we need to get a filter somewhere or create an actual filter on the forked node first
	it.todo('should NOT create a cache entry', async () => {
		await client.tevm.request({ method: 'eth_uninstallFilter', params: ['0x1'] })
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_uninstallFilter'), 'eth_uninstallFilter should NOT be cached')
	})
})
