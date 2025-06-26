import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'
import { numberToHex, type Hex } from 'viem'

describe.sequential('eth_getLogs', () => {
	it('should create a cache entry with a static block numbers', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getLogs',
			params: [{ fromBlock: BLOCK_NUMBER, toBlock: BLOCK_NUMBER }],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getLogs'), 'eth_getLogs should be cached')
	})

	it('should NOT create a cache entry with dynamic block tags', async () => {
		const latestBlock = await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_blockNumber' }) as Hex
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getLogs',
			params: [{ fromBlock: numberToHex(BigInt(latestBlock) - 1n), toBlock: 'latest' }],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_getLogs'), 'eth_getLogs should NOT be cached')
	})
})
