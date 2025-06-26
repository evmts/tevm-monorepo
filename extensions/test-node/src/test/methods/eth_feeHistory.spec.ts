import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'

describe('eth_feeHistory', () => {
	const client = getTestClient()

	it('should create a cache entry with a static newest block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_feeHistory',
			params: [1, BLOCK_NUMBER, [1, 2, 3]],
		})
		await client.flush()

		assertMethodCached('eth_feeHistory', (params) => params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic newest block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_feeHistory',
			params: [1, 'latest', [1, 2, 3]],
		})
		await client.flush()

		assertMethodNotCached('eth_feeHistory', (params) => params[1] === 'latest')
	})
})
