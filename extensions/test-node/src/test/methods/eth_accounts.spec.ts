import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodNotCached } from '../utils.js'

describe('eth_accounts', () => {
	const client = getTestClient()

	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_accounts' })
		await client.flush()

		assertMethodNotCached('eth_accounts')
	})
})
