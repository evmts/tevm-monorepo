import { rm } from 'node:fs/promises'
import path from 'node:path'
import { mainnet } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { http, numberToHex } from 'viem'
import { afterEach, describe, expect, it } from 'vitest'
import { createTestSnapshotClient } from './createTestSnapshotClient.js'
import { BLOCK_NUMBER } from './test/constants.js'
import { assertMethodCached, assertMethodNotCached } from './test/snapshot-utils.js'

describe('createTestSnapshotClient', () => {
	afterEach(async () => {
		await rm(path.join(__dirname, '__rpc_snapshots__', `${path.basename(__filename)}.snap.json`), { force: true })
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
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should not cache non-cacheable requests', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
		})

		// Make a non-cacheable request (blockNumber is not cached)
		await client.getBlockNumber()
		await client.saveSnapshots()

		// Check no snapshots were created for this
		assertMethodNotCached('eth_blockNumber')
	})

	it('should save snapshots on stop', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
		})

		await client.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })

		await client.server.stop()

		// Should still have saved snapshots
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should save snapshots immediately when autosave is onRequest', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: {
				autosave: 'onRequest',
			},
		})

		await client.server.start()

		// Make first cacheable request - should save immediately
		await client.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) - 1n })
		// Check snapshots were saved immediately (without calling save() or stop())
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === numberToHex(BigInt(BLOCK_NUMBER) - 1n))

		// Make another cacheable request - should add to existing snapshots
		await client.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) - 2n })
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === numberToHex(BigInt(BLOCK_NUMBER) - 2n))

		await client.server.stop()
	})

	it('should not save snapshots immediately when autosave is onStop', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: {
				autosave: 'onStop',
			},
		})

		await client.server.start()

		// Make cacheable request
		await client.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })

		// Check snapshots were NOT saved immediately
		assertMethodNotCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)

		await client.server.stop()

		// Check snapshots were saved on stop
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should not save snapshots automatically when autosave is onSave', async () => {
		const client = createTestSnapshotClient({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: {
				autosave: 'onSave',
			},
		})

		await client.server.start()

		// Make cacheable request
		await client.getBlock({ blockNumber: BigInt(BLOCK_NUMBER) })

		// Check snapshots were NOT saved automatically
		assertMethodNotCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)

		await client.server.stop()

		// Should still not be saved after stop
		assertMethodNotCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)

		// Only saved when manually calling saveSnapshots
		await client.saveSnapshots()

		// Now should be saved
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)
	})
})
