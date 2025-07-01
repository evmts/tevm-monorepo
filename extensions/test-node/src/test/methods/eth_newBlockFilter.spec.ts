import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_newBlockFilter', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_newBlockFilter' })
		assertMethodNotCached('eth_newBlockFilter')
	})
})
