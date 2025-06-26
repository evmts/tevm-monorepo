import { assert, describe, it } from 'vitest'
import { client, BLOCK_HASH } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getBlockByHash', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getBlockByHash',
			params: [BLOCK_HASH, false],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getBlockByHash'), 'eth_getBlockByHash should be cached')
	})
})
