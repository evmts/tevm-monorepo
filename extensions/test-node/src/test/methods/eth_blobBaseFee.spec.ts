import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe('eth_blobBaseFee', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_blobBaseFee' })
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_blobBaseFee'), 'eth_blobBaseFee should NOT be cached')
	})
})
