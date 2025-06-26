import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodNotCached } from '../utils.js'

describe('eth_newFilter', () => {
	const client = getTestClient()

	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_newFilter',
			params: [{ fromBlock: BLOCK_NUMBER, toBlock: 'latest' }],
		})
		await client.flush()

		assertMethodNotCached('eth_newFilter')
	})
})
