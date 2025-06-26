import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'

describe.sequential('eth_getStorageAt', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getStorageAt',
			params: [PREFUNDED_ACCOUNTS[0].address, '0x0', BLOCK_NUMBER],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getStorageAt'), 'eth_getStorageAt should be cached')
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getStorageAt',
			params: [PREFUNDED_ACCOUNTS[0].address, '0x0', 'latest'],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getStorageAt'), 'eth_getStorageAt should NOT be cached')
	})
})
