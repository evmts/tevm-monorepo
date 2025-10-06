import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_newFilter', () => {
	it('should NOT create a cache entry', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_newFilter',
			params: [{ fromBlock: BLOCK_NUMBER, toBlock: 'latest' }],
		})

		await client.saveSnapshots()
		assertMethodNotCached('eth_newFilter')
	})
})
