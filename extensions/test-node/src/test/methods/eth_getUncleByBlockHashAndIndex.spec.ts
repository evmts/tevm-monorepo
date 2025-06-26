import { assert, describe, it } from 'vitest'
import { BLOCK_HASH, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getUncleByBlockHashAndIndex', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getUncleByBlockHashAndIndex',
			params: [BLOCK_HASH, '0x0'],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getUncleByBlockHashAndIndex'), 'eth_getUncleByBlockHashAndIndex should be cached')
	})
})
