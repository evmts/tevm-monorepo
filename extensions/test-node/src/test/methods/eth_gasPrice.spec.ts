import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_gasPrice', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_gasPrice' })
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_gasPrice'), 'eth_gasPrice should NOT be cached')
	})
})
