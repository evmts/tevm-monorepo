import { assert, describe, it } from 'vitest'
import { getHarLogEntries } from '../utils.js'
import { client } from '../../vitest.setup.js'

describe.sequential('eth_maxPriorityFeePerGas', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_maxPriorityFeePerGas' })
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_maxPriorityFeePerGas'), 'eth_maxPriorityFeePerGas should NOT be cached')
	})
})
