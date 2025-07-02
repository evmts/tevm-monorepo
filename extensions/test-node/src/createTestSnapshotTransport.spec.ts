import fs from 'node:fs'
import path from 'node:path'
import { createMemoryClient } from '@tevm/memory-client'
import { transports } from '@tevm/test-utils'
import { http, type EIP1193RequestFn, type EIP1474Methods, numberToHex } from 'viem'
import { afterEach, describe, expect, it } from 'vitest'
import { createTestSnapshotTransport } from './createTestSnapshotTransport.js'
import { BLOCK_NUMBER } from './test/constants.js'
import { assertMethodCached, assertMethodNotCached } from './test/snapshot-utils.js'

describe('createTestSnapshotTransport', () => {
	const testCacheDir = path.join(process.cwd(), '.test-test-snapshot-transport')

	afterEach(async () => {
		if (fs.existsSync(testCacheDir)) {
			fs.rmSync(testCacheDir, { recursive: true, force: true })
		}
	})

	it('should create a transport with all required methods', async () => {
		const transport = createTestSnapshotTransport({
			transport: http('https://mainnet.optimism.io')({}),
			test: { cacheDir: testCacheDir },
		})

		expect(transport).toHaveProperty('server')
		expect(typeof transport.request).toBe('function')
		expect(transport.server).toHaveProperty('http')
		expect(transport.server).toHaveProperty('rpcUrl')
		expect(typeof transport.server.start).toBe('function')
		expect(typeof transport.server.stop).toBe('function')
		expect(typeof transport.saveSnapshots).toBe('function')
	})

	it('should start and stop server correctly', async () => {
		const { server } = createTestSnapshotTransport({
			transport: transports.mainnet,
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
		const transport = createTestSnapshotTransport({
			transport: transports.mainnet as { request: EIP1193RequestFn<EIP1474Methods> },
			test: { cacheDir: testCacheDir },
		})

		// Make a cacheable request
		const block = await transport.request({
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: [BLOCK_NUMBER, false],
		})
		// Should return the correct result
		expect(block).toBeDefined()
		expect(block?.number).toBe(BLOCK_NUMBER)

		// Save to ensure snapshots are written
		await transport.saveSnapshots()

		// Check snapshots were created
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDir)
	})

	it('should not cache non-cacheable requests', async () => {
		const transport = createTestSnapshotTransport({
			transport: transports.mainnet as { request: EIP1193RequestFn<EIP1474Methods> },
			test: { cacheDir: testCacheDir },
		})

		// Make a non-cacheable request (blockNumber is not cached)
		await transport.request({
			jsonrpc: '2.0',
			method: 'eth_blockNumber',
			id: 1,
		})
		await transport.saveSnapshots()

		// Check no snapshots were created for this
		assertMethodNotCached('eth_blockNumber', undefined, testCacheDir)
	})

	it('should save snapshots on stop', async () => {
		const transport = createTestSnapshotTransport({
			transport: transports.mainnet as { request: EIP1193RequestFn<EIP1474Methods> },
			test: { cacheDir: testCacheDir },
		})

		await transport.request({
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: [BLOCK_NUMBER, false],
		})

		await transport.server.stop()

		// Should still have saved snapshots
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDir)
	})

	it('should save snapshots immediately when autosave is onRequest', async () => {
		const testCacheDirOnRequest = path.join(process.cwd(), '.test-autosave-on-request')

		// Clean up from any previous runs
		if (fs.existsSync(testCacheDirOnRequest)) {
			fs.rmSync(testCacheDirOnRequest, { recursive: true, force: true })
		}

		const transport = createTestSnapshotTransport({
			transport: transports.mainnet as { request: EIP1193RequestFn<EIP1474Methods> },
			test: {
				cacheDir: testCacheDirOnRequest,
				autosave: 'onRequest',
			},
		})

		await transport.server.start()

		// Make first cacheable request - should save immediately
		await transport.request({
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: [numberToHex(BigInt(BLOCK_NUMBER) - 1n), false],
		})
		// Check snapshots were saved immediately (without calling save() or stop())
		assertMethodCached(
			'eth_getBlockByNumber',
			(params) => params[0] === numberToHex(BigInt(BLOCK_NUMBER) - 1n),
			testCacheDirOnRequest,
		)

		// Make another cacheable request - should add to existing snapshots
		await transport.request({
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: [numberToHex(BigInt(BLOCK_NUMBER) - 2n), false],
		})
		assertMethodCached(
			'eth_getBlockByNumber',
			(params) => params[0] === numberToHex(BigInt(BLOCK_NUMBER) - 2n),
			testCacheDirOnRequest,
		)

		await transport.server.stop()

		// Clean up
		if (fs.existsSync(testCacheDirOnRequest)) {
			fs.rmSync(testCacheDirOnRequest, { recursive: true, force: true })
		}
	})

	it('should not save snapshots immediately when autosave is onStop (default)', async () => {
		const testCacheDirOnStop = path.join(process.cwd(), '.test-autosave-on-stop')

		// Clean up from any previous runs
		if (fs.existsSync(testCacheDirOnStop)) {
			fs.rmSync(testCacheDirOnStop, { recursive: true, force: true })
		}

		const transport = createTestSnapshotTransport({
			transport: transports.mainnet as { request: EIP1193RequestFn<EIP1474Methods> },
			test: {
				cacheDir: testCacheDirOnStop,
				autosave: 'onStop', // explicit, but this is the default
			},
		})

		await transport.server.start()

		// Make cacheable request
		await transport.request({
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: [BLOCK_NUMBER, false],
		})

		// Check snapshots were NOT saved immediately
		assertMethodNotCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDirOnStop)

		await transport.server.stop()

		// Check snapshots were saved on stop
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDirOnStop)

		// Clean up
		if (fs.existsSync(testCacheDirOnStop)) {
			fs.rmSync(testCacheDirOnStop, { recursive: true, force: true })
		}
	})

	it('should work as a transport in a memory client', async () => {
		const client = createMemoryClient({
			fork: {
				transport: createTestSnapshotTransport({
					transport: transports.mainnet as { request: EIP1193RequestFn<EIP1474Methods> },
					test: { cacheDir: testCacheDir, autosave: 'onRequest' },
				}),
			},
		})

		const block = await client.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })
		expect(block?.number).toBe(BigInt(BLOCK_NUMBER))

		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDir)
	})
})
