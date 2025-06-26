import { type Hex, numberToHex } from 'viem'
import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'

describe('eth_getLogs', () => {
	const client = getTestClient()

	it('should create a cache entry with a static block numbers', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getLogs',
			params: [{ fromBlock: BLOCK_NUMBER, toBlock: BLOCK_NUMBER }],
		})
		await client.flush()

		assertMethodCached(
			'eth_getLogs',
			(params) => params[0].fromBlock === BLOCK_NUMBER && params[0].toBlock === BLOCK_NUMBER,
		)
	})

	it('should NOT create a cache entry with dynamic block tags', async () => {
		const latestBlock = (await client.tevm.transport.tevm.forkTransport?.request({ method: 'eth_blockNumber' })) as Hex
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getLogs',
			params: [{ fromBlock: numberToHex(BigInt(latestBlock) - 1n), toBlock: 'latest' }],
		})
		await client.flush()

		assertMethodNotCached('eth_getLogs', (params) => params[0].toBlock === 'latest')
	})
})
