import fs from 'node:fs'
import path from 'node:path'
import { http } from 'viem'
import { afterEach, assert, describe, expect, it } from 'vitest'
import { createCachedTransport } from './createCachedTransport.js'
import { SnapshotManager } from './SnapshotManager.js'

describe('createCachedTransport', () => {
	const testCacheDir = path.join(process.cwd(), '.test-create-cached-transport')
	const optimismTransport = http('https://mainnet.optimism.io')({})
	const snapshotManager = new SnapshotManager(testCacheDir)

	afterEach(() => {
		if (fs.existsSync(testCacheDir)) {
			fs.rmSync(testCacheDir, { recursive: true, force: true })
		}
	})

	it('should pass through non-cacheable methods', async () => {
		const cachedTransport = createCachedTransport(optimismTransport, snapshotManager, 'onStop')
		const result = await cachedTransport.request({ method: 'eth_blockNumber', params: [] })

		// Should return a valid block number
		expect(result).toBeDefined()
		// Should not be cached
		expect(snapshotManager.has(result as string)).toBe(false)
	})

	it('should cache cacheable methods', async () => {
		const cachedTransport = createCachedTransport(optimismTransport, snapshotManager, 'onStop')

		// Use a specific historical block on Optimism
		const blockNumber = '0x1000000'
		const params = [blockNumber, false]

		// First call - should fetch from transport
		const result1 = await cachedTransport.request({
			method: 'eth_getBlockByNumber',
			params,
		})

		// Should return a valid block
		expect(result1).toBeDefined()
		expect(result1).toHaveProperty('number', blockNumber)
		expect(result1).toHaveProperty('hash')

		// Check it was cached - the cache key includes chain ID
		const cacheKeys = Array.from(snapshotManager['snapshots'].keys())
		const blockCacheKey = cacheKeys.find((key) => key.includes('eth_getBlockByNumber') && key.includes(blockNumber))
		expect(blockCacheKey).toBeDefined()
		expect(snapshotManager.get(blockCacheKey!)).toStrictEqual(result1)

		// Second call - should return from cache (using same snapshot manager)
		const result2 = await cachedTransport.request({
			method: 'eth_getBlockByNumber',
			params,
		})
		expect(result2).toStrictEqual(result1)
	})

	it('should create cache key with method and params', async () => {
		const cachedTransport = createCachedTransport(optimismTransport, snapshotManager, 'onStop')

		const blockNumber = '0x1000000'
		const result = await cachedTransport.request({
			method: 'eth_getBlockByNumber',
			params: [blockNumber, false],
		})

		expect(result).toBeDefined()
		expect(result).toHaveProperty('number', blockNumber)

		// Should be cached with a key containing the method and block number
		const cacheKeys = Array.from(snapshotManager['snapshots'].keys())
		const blockCacheKey = cacheKeys.find((key) => key.includes('eth_getBlockByNumber') && key.includes(blockNumber))
		expect(blockCacheKey).toBeDefined()
		// The cache key should be in format [jsonrpc, method, blockNumber, includeTransactions]
		expect(blockCacheKey).toMatch(/\[.*,"eth_getBlockByNumber","0x1000000",false\]/)
	})

	it('should not cache on error', async () => {
		const cachedTransport = createCachedTransport(optimismTransport, snapshotManager, 'onStop')

		// Use an invalid block number that will cause an error
		try {
			await cachedTransport.request({
				method: 'eth_getBlockByNumber',
				params: ['0xffffffffffffffff', true], // Very high block number
			})
		} catch (_) {
			// Should not cache errors
			const cacheKeys = Array.from(snapshotManager['snapshots'].keys())
			const errorKey = cacheKeys.find((key) => key.includes('0xffffffffffffffff'))
			expect(errorKey).toBeUndefined()
		}
	})

	it('should handle real transport correctly', async () => {
		const cachedTransport = createCachedTransport(optimismTransport, snapshotManager, 'onStop')

		const result = await cachedTransport.request({
			method: 'eth_getBlockByNumber',
			params: ['0x1000000', true],
		})

		expect(result).toBeDefined()
		expect(result).toHaveProperty('number', '0x1000000')
		expect(result).toHaveProperty('hash')
		expect(result).toHaveProperty('transactions')
	})

	it('should handle non-hex block numbers correctly', async () => {
		const cachedTransport = createCachedTransport(optimismTransport, snapshotManager, 'onStop')

		const result = await cachedTransport.request({
			method: 'eth_getBlockByNumber',
			params: ['latest', true],
		})

		expect(result).toBeDefined()
		expect(result).toHaveProperty('number')
		// Should not be cached since 'latest' is not a hex number
		assert(!Array.from(snapshotManager['snapshots'].keys()).some((key) => key.includes('latest')))
	})

	it('should persist snapshots across transport instances', async () => {
		const cachedTransport = createCachedTransport(optimismTransport, snapshotManager, 'onStop')

		const blockNumber = '0x1000000'
		const originalResult = await cachedTransport.request({
			method: 'eth_getBlockByNumber',
			params: [blockNumber, true],
		})

		// Save snapshots
		await snapshotManager.save()

		// Create new snapshot manager and transport
		const newSnapshotManager = new SnapshotManager(testCacheDir)
		const newCachedTransport = createCachedTransport(optimismTransport, newSnapshotManager, 'onStop')

		const cachedResult = await newCachedTransport.request({
			method: 'eth_getBlockByNumber',
			params: [blockNumber, true],
		})

		expect(cachedResult).toStrictEqual(originalResult)
	})
})
