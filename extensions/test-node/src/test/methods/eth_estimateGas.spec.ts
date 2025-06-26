import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'

const EF = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'

describe.sequential('eth_estimateGas', () => {
	it('should create a cache entry with a static block number', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_estimateGas',
			params: [{
				from: EF,
				to: PREFUNDED_ACCOUNTS[1].address,
				data: '0x',
			}, BLOCK_NUMBER],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_estimateGas'), 'eth_estimateGas should be cached')
	})

	it('should NOT create a cache entry with a dynamic block tag', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_estimateGas',
			params: [{
				from: EF,
				to: PREFUNDED_ACCOUNTS[1].address,
				data: '0x',
			}, 'latest'],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_estimateGas'), 'eth_estimateGas should NOT be cached')
	})
})
