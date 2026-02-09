import { rm } from 'node:fs/promises'
import { mainnet } from '@tevm/common'
import { http, numberToHex } from 'viem'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestSnapshotNode } from './createTestSnapshotNode.js'
import { resolveVitestTestSnapshotPath } from './internal/resolveVitestTestSnapshotPath.js'
import { BLOCK_NUMBER } from './test/constants.js'
import { assertMethodCached, assertMethodNotCached } from './test/snapshot-utils.js'
import { transports } from './test/transports.js'

describe('createTestSnapshotNode', () => {
	const clearSnapshot = async () => {
		await rm(resolveVitestTestSnapshotPath(), { force: true })
	}

	beforeEach(clearSnapshot)
	afterEach(async () => {
		await clearSnapshot()
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
		})

		// Make a cacheable request
		const block = await (client as any).request({
			method: 'eth_getBlockByNumber',
			params: [BLOCK_NUMBER, false] as any,
		})
		// Should return the correct result
		expect((block as any)?.number).toBe(BLOCK_NUMBER)

		// Save to ensure snapshots are written
		await client.saveSnapshots()

		// Check snapshots were created
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should not cache non-cacheable requests', async () => {
		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
		})

		// Make a non-cacheable request (blockNumber is not cached)
		await (client as any).request({
			method: 'eth_blockNumber',
			params: [],
		})
		await client.saveSnapshots()

		// Check no snapshots were created for this
		assertMethodNotCached('eth_blockNumber')
	})

	it('should save snapshots on stop', async () => {
		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
		})

		await (client as any).request({
			method: 'eth_getBlockByNumber',
			params: [BLOCK_NUMBER, false] as any,
		})
		await client.server.stop()

		// Should still have saved snapshots
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)
	})

	it('should save snapshots immediately when autosave is onRequest', async () => {
		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: {
				autosave: 'onRequest',
			},
		})

		await client.server.start()
		const forkTransport = (client as any).forkTransport
		expect(forkTransport).toBeDefined()

		// Make first cacheable request - should save immediately
		await forkTransport.request({
			method: 'eth_getBlockByNumber',
			params: [numberToHex(BigInt(BLOCK_NUMBER) - 1n), false] as any,
		})
		// Check snapshots were saved immediately (without calling save() or stop())
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === numberToHex(BigInt(BLOCK_NUMBER) - 1n))

		// Make another cacheable request - should add to existing snapshots
		await forkTransport.request({
			method: 'eth_getBlockByNumber',
			params: [numberToHex(BigInt(BLOCK_NUMBER) - 2n), false] as any,
		})
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === numberToHex(BigInt(BLOCK_NUMBER) - 2n))

		await client.server.stop()
	})

	it('should not save snapshots immediately when autosave is onStop (default)', async () => {
		const client = createTestSnapshotNode({
			fork: {
				transport: transports.mainnet,
			},
			common: mainnet,
			test: {
				autosave: 'onStop', // explicit, but this is the default
			},
		})

		await client.server.start()
		const forkTransport = (client as any).forkTransport
		expect(forkTransport).toBeDefined()

		// Make cacheable request
		await forkTransport.request({
			method: 'eth_getBlockByNumber',
			params: [BLOCK_NUMBER, false] as any,
		})

		// Check snapshots were NOT saved immediately
		assertMethodNotCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)

		await client.server.stop()

		// Check snapshots were saved on stop
		assertMethodCached('eth_getBlockByNumber', (params) => params[0] === BLOCK_NUMBER)
	})
})
