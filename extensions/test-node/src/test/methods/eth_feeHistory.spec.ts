import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_feeHistory', () => {
	it('should create a cache entry with a static newest block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_feeHistory',
			params: ['0x1', BLOCK_NUMBER, [1, 2, 3]],
		})

		assertMethodCached('eth_feeHistory', (params) => params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic newest block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_feeHistory',
			params: ['0x1', 'latest', [1, 2, 3]],
		})

		assertMethodNotCached('eth_feeHistory', (params) => params[1] === 'latest')
	})
})
