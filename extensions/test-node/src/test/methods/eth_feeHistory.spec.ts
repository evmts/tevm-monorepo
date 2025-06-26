import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_feeHistory', () => {
	it('should create a cache entry with a static newest block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_feeHistory',
			params: [1, BLOCK_NUMBER, [1, 2, 3]],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_feeHistory'), 'eth_feeHistory should be cached')
	})

	it('should NOT create a cache entry with a dynamic newest block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_feeHistory',
			params: [1, 'latest', [1, 2, 3]],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_feeHistory'), 'eth_feeHistory should NOT be cached')
	})
})
