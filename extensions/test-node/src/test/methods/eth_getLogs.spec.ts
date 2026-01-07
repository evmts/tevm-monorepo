import { type Hex, numberToHex } from '@tevm/utils'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_getLogs', () => {
	it('should create a cache entry with a static block numbers', async () => {
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getLogs',
			params: [{ fromBlock: BLOCK_NUMBER, toBlock: BLOCK_NUMBER }],
		})

		await client.saveSnapshots()
		assertMethodCached('eth_getLogs', (params) => params[0] === BLOCK_NUMBER && params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with dynamic block tags', async () => {
		const latestBlock = (await client.transport.tevm.forkTransport?.request({ method: 'eth_blockNumber' })) as Hex
		await client.transport.tevm.forkTransport?.request({
			method: 'eth_getLogs',
			params: [{ fromBlock: numberToHex(BigInt(latestBlock) - 1n), toBlock: 'latest' }],
		})

		await client.saveSnapshots()
		assertMethodNotCached(
			'eth_getLogs',
			(params) => params[0] === numberToHex(BigInt(latestBlock) - 1n) && params[1] === 'latest',
		)
	})
})
