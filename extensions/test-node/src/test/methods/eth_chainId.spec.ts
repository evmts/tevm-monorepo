import { describe, it } from 'vitest'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_chainId', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_chainId' })
		await client.save()
		assertMethodCached('eth_chainId')
	})
})
