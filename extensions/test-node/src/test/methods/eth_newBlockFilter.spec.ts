import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_newBlockFilter', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_newBlockFilter' })
		await client.save()
		assertMethodNotCached('eth_newBlockFilter')
	})
})
