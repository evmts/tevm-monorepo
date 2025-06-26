import { describe, expect, it } from 'vitest'
import { BLOCK_HASH, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_getTransactionByBlockHashAndIndex', () => {
	it('should create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionByBlockHashAndIndex',
			params: [BLOCK_HASH, '0x0'],
		})
		await client.stop()

		const entries = getHarLogEntries()
		expect(entries.length).toBe(2)
	})
})
