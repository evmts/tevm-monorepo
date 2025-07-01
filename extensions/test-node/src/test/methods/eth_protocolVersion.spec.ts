import { describe, it } from 'vitest'
import { assertMethodCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_protocolVersion', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_protocolVersion' })
		assertMethodCached('eth_protocolVersion')
	})
})
