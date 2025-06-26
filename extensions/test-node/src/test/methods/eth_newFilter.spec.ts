import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_newFilter', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_newFilter',
			params: [{ fromBlock: BLOCK_NUMBER, toBlock: 'latest' }],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_newFilter'), 'eth_newFilter should NOT be cached')
	})
})
