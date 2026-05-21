import { type Hex, numberToHex } from 'viem'
import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_newFilter', () => {
	it('should NOT create a cache entry', async () => {
		const latestBlock = await client.transport.tevm.forkTransport?.request({ method: 'eth_blockNumber' })
		if (!latestBlock) throw new Error('Latest block not found')
		try {
			await client.transport.tevm.forkTransport?.request({
				method: 'eth_newFilter',
				params: [{ fromBlock: numberToHex(BigInt(latestBlock as Hex) - 1n), toBlock: 'latest' }],
			})
		} catch (_error) {}

		await client.saveSnapshots()
		assertMethodNotCached('eth_newFilter')
	})
})
