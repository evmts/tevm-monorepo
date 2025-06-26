import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getTransactionByBlockNumberAndIndex', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByBlockNumberAndIndex',
			params: [BLOCK_NUMBER, '0x0'],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getTransactionByBlockNumberAndIndex'), 'eth_getTransactionByBlockNumberAndIndex should be cached')
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByBlockNumberAndIndex',
			params: ['latest', '0x0'],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getTransactionByBlockNumberAndIndex'), 'eth_getTransactionByBlockNumberAndIndex should NOT be cached')
	})
})
