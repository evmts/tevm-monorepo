import { assert, describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { getHarLogEntries } from '../utils.js'

describe('eth_accounts', () => {
	it('should NOT create a cache entry', async () => {
		const client = getTestClient()
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_accounts' })
		await client.flush()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_accounts'), 'eth_accounts should NOT be cached')
	})
})
