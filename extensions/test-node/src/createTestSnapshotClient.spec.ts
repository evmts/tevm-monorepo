import fs from 'node:fs'
import path from 'node:path'
import { mainnet } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { http } from 'viem'
import { assert, afterEach, describe, expect, it } from 'vitest'
import { createTestSnapshotClient } from './createTestSnapshotClient.js'
import { BLOCK_NUMBER } from './test/constants.js'
import { getSnapshotEntries } from './test/snapshot-utils.js'

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

		expect(client).toHaveProperty('server')
		expect(client.server).toHaveProperty('http')
		expect(client.server).toHaveProperty('rpcUrl')
		expect(typeof client.server.start).toBe('function')
		expect(typeof client.server.stop).toBe('function')
		expect(typeof client.saveSnapshots).toBe('function')
	})

	it('should start and stop server correctly', async () => {
		const { server } = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		// Initially no rpcUrl
		expect(server.rpcUrl).toBe('')

		// Start server
		await server.start()
		expect(server.rpcUrl).toMatch(/^http:\/\/localhost:\d+$/)

		// Starting again should be no-op
		const firstUrl = server.rpcUrl
		await server.start()
		expect(server.rpcUrl).toBe(firstUrl)

		// Stop server
		await server.stop()

		// Stopping again should be no-op
		await server.stop()
	})

	it('should cache RPC requests', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		// Make a cacheable request
		const block = await client.getBlock({
			blockNumber: BigInt(BLOCK_NUMBER),
		})
		// Should return the correct result
		expect(block).toBeDefined()
		expect(block.number).toBe(BigInt(BLOCK_NUMBER))

		// Save to ensure snapshots are written
		await client.saveSnapshots()

		// Check snapshots were created
		const snapshots = getSnapshotEntries(testCacheDir)
		assert(
			Object.entries(snapshots).some(
				([key, value]) => key.includes('eth_getBlockByNumber') && value?.number === BLOCK_NUMBER,
			),
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
		await client.getBlockNumber()
		await client.saveSnapshots()

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

		await client.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })

		await client.server.stop()

		// Should still have saved snapshots
		const snapshots = getSnapshotEntries(testCacheDir)
		expect(Object.keys(snapshots).length).toBeGreaterThan(0)
	})
})
