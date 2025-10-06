import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_accounts', () => {
	it('should NOT create a cache entry', async () => {
		await client.transport.tevm.forkTransport?.request({ method: 'eth_accounts' })
		await client.saveSnapshots()
		assertMethodNotCached('eth_accounts')
	})
})
