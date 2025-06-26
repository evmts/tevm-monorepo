import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { getHarLogEntries } from '../utils.js'

// TODO: fix distance to target block exceeds maximum proof window
describe.todo('eth_getProof', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getProof',
			params: [PREFUNDED_ACCOUNTS[0].address, ['0x0'], BLOCK_NUMBER],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getProof'), 'eth_getProof should be cached')
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getProof',
			params: [PREFUNDED_ACCOUNTS[0].address, ['0x0'], 'latest'],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getProof'), 'eth_getProof should NOT be cached')
	})
})
