import { assert, describe, expect, it } from 'vitest'
import { BLOCK_NUMBER } from '../test/constants.js'
import { getHarLogEntries } from '../test/utils.js'
import { numberToHex } from 'viem'
import { getTestClient } from './client.js'

describe('test-node client', () => {
	const client = getTestClient()

	it('should cache cached rpc requests', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		// Flush recordings before checking files
		await client.flush()

		// Verify the HAR file contains external RPC requests
		const entries = getHarLogEntries()
		const getBlockEntries = entries.filter((entry) => JSON.parse(entry.request.postData?.text ?? '').method === 'eth_getBlockByNumber')
		expect(getBlockEntries.length).toBeGreaterThan(0)
		assert(getBlockEntries.some(entry => JSON.parse(entry.response.content.text ?? '').result.number === numberToHex(BigInt(BLOCK_NUMBER))), 'Block number should be cached')
	})

	it('should cache multiple rpc requests in different flushes', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		await client.flush()
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) - 1n })
		await client.flush()

		// Verify the HAR file contains external RPC requests
		const entries = getHarLogEntries()
		const getBlockEntries = entries.filter((entry) => JSON.parse(entry.request.postData?.text ?? '').method === 'eth_getBlockByNumber')
		expect(getBlockEntries.length).toBeGreaterThan(1)
		assert(getBlockEntries.some(entry => JSON.parse(entry.response.content.text ?? '').result.number === BLOCK_NUMBER), 'Block number should be cached')
		assert(getBlockEntries.some(entry => JSON.parse(entry.response.content.text ?? '').result.number === numberToHex(BigInt(BLOCK_NUMBER) - 1n)), 'Block number should be cached')
	})

	it('should not cache uncached rpc requests', async () => {
		const entriesBefore = getHarLogEntries()
		await client.tevm.getBlock({ blockTag: 'latest' })
		await client.flush()

		expect(getHarLogEntries()).toStrictEqual(entriesBefore)
	})

	it('should not cache localhost requests', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		await client.flush()

		const entries = getHarLogEntries()
		assert(!entries.some((entry) => entry.request.url.includes('localhost') || entry.request.url.includes('127.0.0.1')))
	})
})
