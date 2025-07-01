import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_accounts', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_accounts' })
		assertMethodNotCached('eth_accounts')
	})
})
