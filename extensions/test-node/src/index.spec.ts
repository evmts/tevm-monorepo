import { describe, expect, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../vitest.setup.js'
import { getHarLogEntries } from './test/utils.js'

describe('createTestSnapshotClient', () => {
	// For reference, if we didn't pass the `common` to the client, it would be forced to fetch the chainId before initializing polly
	// which would make us miss fetching the forked block and caching it in snapshots
	// meaning that these tests would fail as it would hit the state manager cache, without ever recording the snapshot
	it('should cache cached rpc requests', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		// Stop the client to flush recordings before checking files
		await client.stop()

		// Verify the HAR file contains external RPC requests
		const entries = getHarLogEntries()
		expect(entries.length).toBe(1)
		// `eth_getBlockByNumber`
		expect(JSON.parse(entries[0].response.content.text).result.number).toBe(BLOCK_NUMBER)
	})

	it('should read from cached rpc requests', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		await client.stop()

		const entries = getHarLogEntries()

		// Make a request with a different ID to test method-based caching
		await client.start()
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		// Stop the client to flush recordings before checking files
		await client.stop()

		// Check the file system for the snapshot after stopping
		// It should not have been modified (this includes the polly snapshot ids)
		expect(getHarLogEntries()).toStrictEqual(entries)
	})

	it('should not cache uncached rpc requests', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		await client.stop()

		const entries = getHarLogEntries()

		// Make a request with an uncached method
		await client.start()
		await client.tevm.getBlock({ blockTag: 'latest' })

		// Stop the client to flush recordings before checking files
		await client.stop()

		expect(getHarLogEntries()).toStrictEqual(entries)
	})
})
