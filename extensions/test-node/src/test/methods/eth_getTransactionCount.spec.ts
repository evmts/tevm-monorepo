import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getTransactionCount', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionCount',
			params: [PREFUNDED_ACCOUNTS[0].address, BLOCK_NUMBER],
		})

		assertMethodCached('eth_getTransactionCount', (params) => params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionCount',
			params: [PREFUNDED_ACCOUNTS[0].address, 'latest'],
		})

		assertMethodNotCached('eth_getTransactionCount', (params) => params[1] === 'latest')
	})
})
