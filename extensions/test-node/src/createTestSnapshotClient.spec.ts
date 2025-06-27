import { mainnet } from '@tevm/common'
import { http } from 'viem'
import { afterEach, assert, describe, expect, it } from 'vitest'
import { createTestSnapshotClient } from './createTestSnapshotClient.js'
import { BLOCK_NUMBER } from './test/constants.js'
import { getSnapshotEntries } from './test/snapshot-utils.js'
import { transports } from '@tevm/test-utils'
import fs from 'node:fs'
import path from 'node:path'

describe('createTestSnapshotClient', () => {
	const testCacheDir = path.join(process.cwd(), '.test-test-snapshot-client')

	afterEach(async () => {
		if (fs.existsSync(testCacheDir)) {
			fs.rmSync(testCacheDir, { recursive: true, force: true })
		}
	})

	it('should throw error if fork transport is not provided', () => {
		expect(() =>
			createTestSnapshotClient({
				// @ts-expect-error - we want to test the error case
				fork: {},
			}),
		).toThrow('Fork transport is required in options.fork.transport')

		expect(() =>
			createTestSnapshotClient({
				common: mainnet,
			}),
		).toThrow('Fork transport is required in options.fork.transport')
	})

	it('should create a client with all required methods', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: http('https://mainnet.optimism.io')({}),
			},
			test: { cacheDir: testCacheDir },
		})

		expect(client).toHaveProperty('tevm')
		expect(client).toHaveProperty('server')
		expect(client).toHaveProperty('rpcUrl')
		expect(client).toHaveProperty('start')
		expect(client).toHaveProperty('stop')

		expect(typeof client.start).toBe('function')
		expect(typeof client.stop).toBe('function')
	})

	it('should start and stop server correctly', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		// Initially no rpcUrl
		expect(client.rpcUrl).toBe('')

		// Start server
		await client.start()
		expect(client.rpcUrl).toMatch(/^http:\/\/localhost:\d+$/)

		// Starting again should be no-op
		const firstUrl = client.rpcUrl
		await client.start()
		expect(client.rpcUrl).toBe(firstUrl)

		// Stop server
		await client.stop()

		// Stopping again should be no-op
		await client.stop()
	})

	it.only('should cache RPC requests', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		// Make a cacheable request
		const block = await client.tevm.getBlock({
			blockNumber: BigInt(BLOCK_NUMBER),
		})
		// Should return the correct result
		expect(block).toBeDefined()
		expect(block.number).toBe(BigInt(BLOCK_NUMBER))

		// Save to ensure snapshots are written
		await client.save()

		// Check snapshots were created
		const snapshots = getSnapshotEntries(testCacheDir)
		assert(
			Object.entries(snapshots).some(([key, value]) => key.includes('eth_getBlockByNumber') && value?.number === BLOCK_NUMBER),
			'should have cached the block request',
		)
	})

	it('should not cache non-cacheable requests', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		// Make a non-cacheable request (blockNumber is not cached)
		await client.tevm.getBlockNumber()
		await client.save()

		// Check no snapshots were created for this
		const snapshots = getSnapshotEntries(testCacheDir)
		assert(
			!Object.keys(snapshots).some((key) => key.includes('eth_blockNumber')),
			'should not have cached the block number request',
		)
	})

	it('should save snapshots on stop', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		await client.tevm.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })

		await client.stop()

		// Should still have saved snapshots
		const snapshots = getSnapshotEntries(testCacheDir)
		expect(Object.keys(snapshots).length).toBeGreaterThan(0)
	})
})
