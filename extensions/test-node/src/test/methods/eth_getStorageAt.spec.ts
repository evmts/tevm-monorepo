import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getStorageAt', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getStorageAt',
			params: [PREFUNDED_ACCOUNTS[0].address, '0x0', BLOCK_NUMBER],
		})

		await client.save()
		assertMethodCached('eth_getStorageAt', (params) => params[2] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getStorageAt',
			params: [PREFUNDED_ACCOUNTS[0].address, '0x0', 'latest'],
		})

		await client.save()
		assertMethodNotCached('eth_getStorageAt', (params) => params[2] === 'latest')
	})
})
