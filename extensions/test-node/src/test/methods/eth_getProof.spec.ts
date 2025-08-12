import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

// TODO: fix distance to target block exceeds maximum proof window
describe.todo('eth_getProof', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getProof',
			params: [PREFUNDED_ACCOUNTS[0].address, ['0x0'], BLOCK_NUMBER],
		})

		await client.saveSnapshots()
		assertMethodCached('eth_getProof', (params) => params[2] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getProof',
			params: [PREFUNDED_ACCOUNTS[0].address, ['0x0'], 'latest'],
		})

		await client.saveSnapshots()
		assertMethodNotCached('eth_getProof', (params) => params[2] === 'latest')
	})
})
