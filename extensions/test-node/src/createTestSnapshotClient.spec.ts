import { describe, expect, it, afterEach } from 'vitest'
import { createTestSnapshotClient } from './createTestSnapshotClient.js'
import { cleanupSnapshots, getSnapshotEntries } from './test/snapshot-utils.js'
import { BLOCK_NUMBER } from './test/constants.js'
import { http } from 'viem'
import { mainnet } from '@tevm/common'

describe('createTestSnapshotClient', () => {
	const testCacheDir = '.test-client-snapshots'

	afterEach(async () => {
		cleanupSnapshots(testCacheDir)
	})

	it('should throw error if fork transport is not provided', async () => {
		await expect(createTestSnapshotClient({
			fork: {}
		})).rejects.toThrow('Fork transport is required in options.fork.transport')

		await expect(createTestSnapshotClient({
			common: mainnet
		})).rejects.toThrow('Fork transport is required in options.fork.transport')
	})

	it('should create a client with all required methods', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: http('https://mainnet.optimism.io')()
			},
			test: { cacheDir: testCacheDir }
		})

		expect(client).toHaveProperty('tevm')
		expect(client).toHaveProperty('server')
		expect(client).toHaveProperty('rpcUrl')
		expect(client).toHaveProperty('start')
		expect(client).toHaveProperty('stop')
		expect(client).toHaveProperty('flush')
		expect(client).toHaveProperty('destroy')

		expect(typeof client.start).toBe('function')
		expect(typeof client.stop).toBe('function')
	})

	it('should start and stop server correctly', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: http('https://mainnet.optimism.io')()
			},
			test: { cacheDir: testCacheDir }
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

		await client.stop()
	})

	it('should cache RPC requests', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: http(process.env['TEVM_RPC_URLS_MAINNET'] || 'https://mainnet.optimism.io')()
			},
			common: mainnet,
			test: { cacheDir: testCacheDir }
		})

		// Make a cacheable request
		const block = await client.tevm.eth.getBlock({
			blockNumber: BigInt(BLOCK_NUMBER)
		})
		expect(block).toBeDefined()
		expect(block.number).toBe(BigInt(BLOCK_NUMBER))

		// Save to ensure snapshots are written
		await client.save()

		// Check snapshots were created
		const snapshots = getSnapshotEntries(testCacheDir)
		const snapshotKeys = Object.keys(snapshots)
		expect(snapshotKeys.length).toBeGreaterThan(0)

		// Should have cached the block request
		const blockCacheKey = snapshotKeys.find(key => key.includes('eth_getBlockByNumber'))
		expect(blockCacheKey).toBeDefined()

		await client.stop()
	})

	it('should not cache non-cacheable requests', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: http(process.env['TEVM_RPC_URLS_MAINNET'] || 'https://mainnet.optimism.io')()
			},
			test: { cacheDir: testCacheDir }
		})

		// Make a non-cacheable request (blockNumber is not cached)
		await client.tevm.eth.getBlockNumber()
		await client.save()

		// Check no snapshots were created for this
		const snapshots = getSnapshotEntries(testCacheDir)
		const blockNumberKeys = Object.keys(snapshots).filter(key => key.includes('eth_blockNumber'))
		expect(blockNumberKeys.length).toBe(0)

		await client.stop()
	})

	it('should use custom cache directory', async () => {
		const customDir = '.custom-test-cache'
		const client = createTestSnapshotClient({
			fork: {
				transport: http(process.env['TEVM_RPC_URLS_MAINNET'] || 'https://mainnet.optimism.io')()
			},
			test: { cacheDir: customDir }
		})

		await client.tevm.eth.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		await client.save()

		// Check snapshots in custom directory
		const snapshots = getSnapshotEntries(customDir)
		expect(Object.keys(snapshots).length).toBeGreaterThan(0)

		await client.stop()
		cleanupSnapshots(customDir)
	})

	it('should use default cache directory when not specified', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: http(process.env['TEVM_RPC_URLS_MAINNET'] || 'https://mainnet.optimism.io')()
			}
		})

		await client.tevm.eth.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		await client.save()

		// Check snapshots in default directory
		const snapshots = getSnapshotEntries()
		expect(Object.keys(snapshots).length).toBeGreaterThan(0)

		await client.stop()
		cleanupSnapshots()
	})

	it('should handle errors during request', async () => {
		// Create client with invalid transport
		const client = createTestSnapshotClient({
			fork: {
				transport: http('http://invalid-url-that-does-not-exist.com')()
			},
			test: { cacheDir: testCacheDir }
		})

		// Should throw error but not crash
		await expect(client.tevm.eth.getBlock({
			blockNumber: 1n
		})).rejects.toThrow()

		await client.stop()
	})

	it('should save snapshots on destroy', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: http(process.env['TEVM_RPC_URLS_MAINNET'] || 'https://mainnet.optimism.io')()
			},
			test: { cacheDir: testCacheDir }
		})

		await client.tevm.eth.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })

		// Don't flush, just destroy
		await client.stop()

		// Should still have saved snapshots
		const snapshots = getSnapshotEntries(testCacheDir)
		expect(Object.keys(snapshots).length).toBeGreaterThan(0)
	})
})