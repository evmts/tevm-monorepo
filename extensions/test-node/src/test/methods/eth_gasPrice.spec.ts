import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodNotCached } from '../utils.js'

describe('eth_gasPrice', () => {
	const client = getTestClient()

	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_gasPrice' })
		await client.flush()

		assertMethodNotCached('eth_gasPrice')
	})
})
