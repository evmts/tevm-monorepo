import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodCached } from '../utils.js'

describe('eth_protocolVersion', () => {
	const client = getTestClient()

	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_protocolVersion' })
		await client.flush()

		assertMethodCached('eth_protocolVersion')
	})
})
