import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getBlockByNumber', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_getBlockByNumber', params: [BLOCK_NUMBER, false] })
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getBlockByNumber'), 'eth_getBlockByNumber should be cached')
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_getBlockByNumber', params: ['latest', false] })
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getBlockByNumber' && JSON.parse(e.request.postData?.text ?? '').params[0] === 'earliest'), 'eth_getBlockByNumber with dynamic block tag should NOT be cached')
	})
})
