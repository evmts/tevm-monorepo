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

	it('should cache cached rpc requests', async () => {
		// Client requests `eth_getBlockByNumber` with the forked block during initialization
		await client.tevm.tevmReady()

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
		await client.tevm.tevmReady()
		await client.stop()

		const harFilePath = findRecordingHarFiles()?.[0]
		assert(harFilePath, 'No recording.har file found')
		const harContent = fs.readFileSync(harFilePath, 'utf-8')

		// Make a request with a different ID to test method-based caching
		await client.start()
		const getBlockByNumberResponse = await fetch(client.rpcUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'eth_getBlockByNumber',
				params: [BLOCK_NUMBER, false],
				id: 999,
			}),
		})
		expect(getBlockByNumberResponse.status).toBe(200)

		// Stop the client to flush recordings before checking files
		await client.stop()

		// Check the file system for the snapshot after stopping
		const harContent2 = fs.readFileSync(harFilePath, 'utf-8')
		// It should not have been modified (this includes the polly snapshot ids)
		expect(harContent2).toBe(harContent)
	})

	it('should not cache uncached rpc requests', async () => {
		await client.tevm.tevmReady()
		await client.stop()

		const harFilePath = findRecordingHarFiles()?.[0]
		assert(harFilePath, 'No recording.har file found')
		const harContent = fs.readFileSync(harFilePath, 'utf-8')

		// Make a request with an uncached method
		await client.start()
		const response = await fetch(client.rpcUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', id: 1 }),
		})
		expect(response.status).toBe(200)

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