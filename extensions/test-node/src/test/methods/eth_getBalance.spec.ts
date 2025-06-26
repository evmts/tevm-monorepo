import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'

describe('eth_getBalance', () => {
	const client = getTestClient()

	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getBalance',
			params: [PREFUNDED_ACCOUNTS[0].address, BLOCK_NUMBER],
		})
		await client.flush()

		assertMethodCached('eth_getBalance', (params) => params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getBalance',
			params: [PREFUNDED_ACCOUNTS[0].address, 'latest'],
		})
		await client.flush()

		assertMethodNotCached('eth_getBalance', (params) => params[1] === 'latest')
	})
})
