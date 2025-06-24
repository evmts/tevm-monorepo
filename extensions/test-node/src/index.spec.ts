import fs from 'node:fs'
import path from 'node:path'
import { http } from 'viem'
import { afterEach, assert, beforeEach, describe, expect, it } from 'vitest'
import { createTestSnapshotClient } from './index.js'
import type { TestSnapshotClient } from './types.js'
import { optimism } from '@tevm/common'

const BLOCK_NUMBER = '0x833493e'

describe.sequential(createTestSnapshotClient.name, () => {
	let client: TestSnapshotClient

	beforeEach(async () => {
		client = createTestSnapshotClient({
			// TODO: replace with test-utils transports.optimism
			tevm: { fork: { transport: http('https://mainnet.optimism.io')({}), blockTag: BigInt(BLOCK_NUMBER) }, common: optimism },
			snapshot: { dir: path.join(process.cwd(), '__snapshots__', expect.getState().currentTestName ?? 'test') },
		})

		await client.start()
	})

	afterEach(async () => {
		await client.stop()
	})

	// For reference, if we didn't pass the `common` to the client, it would be forced to fetch the chainId before initializing polly
	// which would make us miss fetching the forked block and caching it in snapshots
	// meaning that these tests would fail as it would hit the state manager cache, without ever recording the snapshot
	it('should cache cached rpc requests', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		// Stop the client to flush recordings before checking files
		await client.stop()

		const harFilePath = findRecordingHarFiles()?.[0]
		assert(harFilePath, 'No recording.har file found')

		// Verify the HAR file contains external RPC requests
		const harContent = fs.readFileSync(harFilePath, 'utf-8')
		const harData = JSON.parse(harContent)
		expect(harData.log.entries.length).toBe(1)
		// `eth_getBlockByNumber`
		expect(JSON.parse(harData.log.entries[0].response.content.text).result.number).toBe(
			BLOCK_NUMBER,
		)
	})

	it('should read from cached rpc requests', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		await client.stop()

		const harFilePath = findRecordingHarFiles()?.[0]
		assert(harFilePath, 'No recording.har file found')
		const harContent = fs.readFileSync(harFilePath, 'utf-8')

		// Make a request with a different ID to test method-based caching
		await client.start()
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		// Stop the client to flush recordings before checking files
		await client.stop()

		// Check the file system for the snapshot after stopping
		const harContent2 = fs.readFileSync(harFilePath, 'utf-8')
		// It should not have been modified (this includes the polly snapshot ids)
		expect(harContent2).toBe(harContent)
	})

	it('should not cache uncached rpc requests', async () => {
		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		await client.stop()

		const harFilePath = findRecordingHarFiles()?.[0]
		assert(harFilePath, 'No recording.har file found')
		const harContent = fs.readFileSync(harFilePath, 'utf-8')

		// Make a request with an uncached method
		await client.start()
		await client.tevm.getBlock({ blockTag: 'latest' })

		// Stop the client to flush recordings before checking files
		await client.stop()

		const harContent2 = fs.readFileSync(harFilePath, 'utf-8')
		expect(harContent2).toBe(harContent)
	})
})

const findRecordingHarFiles = (dir = path.join(process.cwd(), '__snapshots__', expect.getState().currentTestName ?? 'test')): string[] => {
	if (!fs.existsSync(dir)) return []
	const results: string[] = []
	const list = fs.readdirSync(dir, { withFileTypes: true })

	for (const file of list) {
		const fullPath = path.join(dir, file.name)
		if (file.isDirectory()) {
			results.push(...findRecordingHarFiles(fullPath))
		} else if (file.name === 'recording.har') {
			results.push(fullPath)
		}
	}

	return results
}