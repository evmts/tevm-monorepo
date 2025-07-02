import fs from 'node:fs'
import path from 'node:path'
import { blockNumberProcedure, ethGetBlockByNumberJsonRpcProcedure } from '@tevm/actions'
import { mainnet } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { http, numberToHex } from 'viem'
import { afterEach, describe, expect, it } from 'vitest'
import { createTestSnapshotNode } from './createTestSnapshotNode.js'
import { BLOCK_NUMBER } from './test/constants.js'
import { assertMethodCached, assertMethodNotCached } from './test/snapshot-utils.js'

describe('createTestSnapshotNode', () => {
	const testCacheDir = path.join(process.cwd(), '.test-test-snapshot-node')

	afterEach(async () => {
		if (fs.existsSync(testCacheDir)) {
			fs.rmSync(testCacheDir, { recursive: true, force: true })
		}
	})

	it('should throw error if fork transport is not provided', () => {
		expect(() =>
			createTestSnapshotNode({
				// @ts-expect-error - we want to test the error case
				fork: {},
			}),
		).toThrow('Fork transport is required in options.fork.transport')

		expect(() =>
			createTestSnapshotNode({
				common: mainnet,
			}),
		).toThrow('Fork transport is required in options.fork.transport')
	})

	it('should create a client with all required methods', async () => {
		const client = createTestSnapshotNode({
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
		const { server } = createTestSnapshotNode({
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
		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		// Make a cacheable request
		const block = await ethGetBlockByNumberJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: [BLOCK_NUMBER, false],
		})
		// Should return the correct result
		expect(block.result?.number).toBe(BLOCK_NUMBER)

		// Save to ensure snapshots are written
		await client.saveSnapshots()

		// Check snapshots were created
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDir)
	})

	it('should not cache non-cacheable requests', async () => {
		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		// Make a non-cacheable request (blockNumber is not cached)
		await blockNumberProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_blockNumber',
			id: 1,
			params: [],
		})
		await client.saveSnapshots()

		// Check no snapshots were created for this
		assertMethodNotCached('eth_blockNumber', undefined, testCacheDir)
	})

	it('should save snapshots on stop', async () => {
		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: { cacheDir: testCacheDir },
		})

		await ethGetBlockByNumberJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: [BLOCK_NUMBER, false],
		})
		await client.server.stop()

		// Should still have saved snapshots
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDir)
	})

	it('should save snapshots immediately when autosave is onRequest', async () => {
		const testCacheDirOnRequest = path.join(process.cwd(), '.test-autosave-on-request')

		// Clean up from any previous runs
		if (fs.existsSync(testCacheDirOnRequest)) {
			fs.rmSync(testCacheDirOnRequest, { recursive: true, force: true })
		}

		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: {
				cacheDir: testCacheDirOnRequest,
				autosave: 'onRequest',
			},
		})

		await client.server.start()

		// Make first cacheable request - should save immediately
		await ethGetBlockByNumberJsonRpcProcedure(client)({
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
		await ethGetBlockByNumberJsonRpcProcedure(client)({
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

		await client.server.stop()

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

		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: {
				cacheDir: testCacheDirOnStop,
				autosave: 'onStop', // explicit, but this is the default
			},
		})

		await client.server.start()

		// Make cacheable request
		await ethGetBlockByNumberJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: [BLOCK_NUMBER, false],
		})

		// Check snapshots were NOT saved immediately
		assertMethodNotCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDirOnStop)

		await client.server.stop()

		// Check snapshots were saved on stop
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER, testCacheDirOnStop)

		// Clean up
		if (fs.existsSync(testCacheDirOnStop)) {
			fs.rmSync(testCacheDirOnStop, { recursive: true, force: true })
		}
	})
})
