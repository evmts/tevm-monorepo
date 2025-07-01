import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_blobBaseFee', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_blobBaseFee' })
		assertMethodNotCached('eth_blobBaseFee')
	})
})
