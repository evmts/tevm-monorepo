import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { createCachedTransport } from './createCachedTransport.js'
import { SnapshotManager } from './SnapshotManager.js'
import { cleanupSnapshots, createMockTransport } from '../test/snapshot-utils.js'
import path from 'node:path'

describe('createCachedTransport', () => {
	const testCacheDir = path.join(process.cwd(), '.test-cached-transport')
	let snapshotManager: SnapshotManager

	beforeEach(async () => {
		cleanupSnapshots(testCacheDir)
		snapshotManager = new SnapshotManager(testCacheDir)
		await snapshotManager.init()
	})

	afterEach(async () => {
		cleanupSnapshots(testCacheDir)
	})

	it('should pass through non-cacheable methods', async () => {
		const mockResponses = {
			'eth_blockNumber:[]': '0x123'
		}
		const mockTransport = createMockTransport(mockResponses)
		const cachedTransport = createCachedTransport(mockTransport as any, snapshotManager)

		const transport = await cachedTransport({})
		const result = await transport.request({ method: 'eth_blockNumber', params: [] })

		expect(result).toBe('0x123')
		// Should not be cached
		expect(snapshotManager.has('0x1:undefined')).toBe(false)
	})

	it('should cache cacheable methods', async () => {
		const blockResponse = {
			number: '0x123',
			hash: '0xabc',
			timestamp: '0x456'
		}
		const mockResponses = {
			'eth_getBlockByNumber:["0x123",true]': blockResponse
		}
		const mockTransport = createMockTransport(mockResponses)
		const cachedTransport = createCachedTransport(mockTransport as any, snapshotManager, '0x1')

		const transport = await cachedTransport({})
		
		// First call - should fetch from transport
		const result1 = await transport.request({ 
			method: 'eth_getBlockByNumber', 
			params: ['0x123', true] 
		})
		expect(result1).toEqual(blockResponse)

		// Check it was cached
		const cacheKey = '0x1:["\\u0002","eth_getBlockByNumber","0x123",true]'
		expect(snapshotManager.has(cacheKey)).toBe(true)
		expect(snapshotManager.get(cacheKey)).toEqual(blockResponse)

		// Second call - should return from cache (mock won't be called)
		const cachedTransport2 = createCachedTransport(createMockTransport({}) as any, snapshotManager, '0x1')
		const transport2 = await cachedTransport2({})
		const result2 = await transport2.request({ 
			method: 'eth_getBlockByNumber', 
			params: ['0x123', true] 
		})
		expect(result2).toEqual(blockResponse)
	})

	it('should fetch chainId if not provided', async () => {
		const blockResponse = { number: '0x456' }
		const mockResponses = {
			'eth_chainId:[]': '0xa', // Chain ID 10
			'eth_getBlockByNumber:["0x456",false]': blockResponse
		}
		const mockTransport = createMockTransport(mockResponses)
		const cachedTransport = createCachedTransport(mockTransport as any, snapshotManager)

		const transport = await cachedTransport({})
		const result = await transport.request({ 
			method: 'eth_getBlockByNumber', 
			params: ['0x456', false] 
		})

		expect(result).toEqual(blockResponse)
		// Should be cached with fetched chain ID
		const cacheKey = '0xa:["\\u0002","eth_getBlockByNumber","0x456",false]'
		expect(snapshotManager.has(cacheKey)).toBe(true)
	})

	it('should not cache on error', async () => {
		const mockTransport = () => ({
			request: async (params: any) => {
				if (params.method === 'eth_chainId') return '0x1'
				throw new Error('RPC Error')
			}
		})
		const cachedTransport = createCachedTransport(mockTransport as any, snapshotManager)

		const transport = await cachedTransport({})
		
		await expect(transport.request({ 
			method: 'eth_getBlockByNumber', 
			params: ['0x789', true] 
		})).rejects.toThrow('RPC Error')

		// Should not cache errors
		const cacheKey = '0x1:["\\u0002","eth_getBlockByNumber","0x789",true]'
		expect(snapshotManager.has(cacheKey)).toBe(false)
	})

	it('should handle transport function that returns transport object', async () => {
		const blockResponse = { number: '0xabc' }
		const mockTransport = {
			request: async (params: any) => {
				if (params.method === 'eth_chainId') return '0x1'
				if (params.method === 'eth_getBlockByNumber') return blockResponse
				throw new Error('Unexpected method')
			}
		}
		const cachedTransport = createCachedTransport(mockTransport as any, snapshotManager)

		const transport = await cachedTransport({})
		const result = await transport.request({ 
			method: 'eth_getBlockByNumber', 
			params: ['0xabc', true] 
		})

		expect(result).toEqual(blockResponse)
	})

	it('should handle non-hex block numbers correctly', async () => {
		const mockResponses = {
			'eth_getBlockByNumber:["latest",true]': { number: '0xdef' }
		}
		const mockTransport = createMockTransport(mockResponses)
		const cachedTransport = createCachedTransport(mockTransport as any, snapshotManager, '0x1')

		const transport = await cachedTransport({})
		const result = await transport.request({ 
			method: 'eth_getBlockByNumber', 
			params: ['latest', true] 
		})

		expect(result).toEqual({ number: '0xdef' })
		// Should not be cached since 'latest' is not a hex number
		expect(Array.from(snapshotManager['snapshots'].keys()).length).toBe(0)
	})

	it('should persist snapshots across transport instances', async () => {
		const blockResponse = { number: '0x999', hash: '0xfff' }
		const mockResponses = {
			'eth_getBlockByNumber:["0x999",true]': blockResponse
		}
		const mockTransport = createMockTransport(mockResponses)
		const cachedTransport = createCachedTransport(mockTransport as any, snapshotManager, '0x1')

		const transport = await cachedTransport({})
		await transport.request({ 
			method: 'eth_getBlockByNumber', 
			params: ['0x999', true] 
		})

		// Create new snapshot manager and transport
		const newSnapshotManager = new SnapshotManager(testCacheDir)
		await newSnapshotManager.init()
		
		const newCachedTransport = createCachedTransport(createMockTransport({}) as any, newSnapshotManager, '0x1')
		const newTransport = await newCachedTransport({})
		
		const cachedResult = await newTransport.request({ 
			method: 'eth_getBlockByNumber', 
			params: ['0x999', true] 
		})

		expect(cachedResult).toEqual(blockResponse)
	})
})