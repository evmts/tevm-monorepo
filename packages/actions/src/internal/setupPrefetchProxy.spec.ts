import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as prefetchModule from './prefetchStorageFromAccessList.js'
import { setupPrefetchProxy } from './setupPrefetchProxy.js'

describe('setupPrefetchProxy', () => {
	beforeEach(() => {
		// Reset mocks before each test
		vi.restoreAllMocks()
	})

	it('should handle empty or undefined accessList', async () => {
		const client = createTevmNode()

		// Create a client with a mock transport
		const originalRequest = vi.fn().mockResolvedValue({ result: 'test' })
		// @ts-expect-error
		client.forkTransport = { request: originalRequest }

		// With undefined accessList, nothing should change
		await setupPrefetchProxy(client, undefined)
		expect(client.forkTransport.request).toBe(originalRequest)

		// With empty accessList, nothing should change
		await setupPrefetchProxy(client, new Map())
		expect(client.forkTransport.request).toBe(originalRequest)
	})

	it('should do nothing if client has no forkTransport', async () => {
		const client = createTevmNode()

		// Ensure client has no forkTransport
		// @ts-expect-error
		client.forkTransport = undefined

		// Create a test access list
		const accessList = new Map([
			[
				'0x1111111111111111111111111111111111111111',
				new Set(['0x0000000000000000000000000000000000000000000000000000000000000001']),
			],
		])

		// Should not throw
		await setupPrefetchProxy(client, accessList)
	})

	it('should proxy the original request function', async () => {
		const client = createTevmNode()

		// Create a client with a mock transport
		const originalResult = { result: 'test' }
		const originalRequest = vi.fn().mockResolvedValue(originalResult)
		// @ts-expect-error
		client.forkTransport = { request: originalRequest }

		// Create a test access list
		const accessList = new Map([
			[
				'0x1111111111111111111111111111111111111111',
				new Set(['0x0000000000000000000000000000000000000000000000000000000000000001']),
			],
		])

		// Set up the proxy
		await setupPrefetchProxy(client, accessList)

		// Original request function should be replaced
		expect(client.forkTransport.request).not.toBe(originalRequest)

		// Make a normal request (not storage related)
		const normalRequest = { method: 'eth_blockNumber', params: [] }
		const result = await client.forkTransport.request(normalRequest)

		// Original function should be called with the request
		expect(originalRequest).toHaveBeenCalledWith(normalRequest)

		// Result should be passed through
		expect(result).toBe(originalResult)
	})

	it('should trigger prefetching on first eth_getStorageAt call', async () => {
		const client = createTevmNode()

		// Mock debug logger
		const debugSpy = vi.spyOn(client.logger, 'debug')

		// Create a client with a mock transport
		const originalRequest = vi.fn().mockResolvedValue({ result: 'test' })
		// @ts-expect-error
		client.forkTransport = { request: originalRequest }

		// Mock prefetchStorageFromAccessList to track calls
		const prefetchSpy = vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList').mockResolvedValue(undefined)

		// Create a test access list
		const accessList = new Map([
			[
				'0x1111111111111111111111111111111111111111',
				new Set(['0x0000000000000000000000000000000000000000000000000000000000000001']),
			],
		])

		// Set up the proxy
		await setupPrefetchProxy(client, accessList)

		// Make a storage-related request
		const storageRequest = {
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		}
		await client.forkTransport.request(storageRequest)

		// Original request should be called
		expect(originalRequest).toHaveBeenCalledWith(storageRequest)

		// Debug log should be called
		expect(debugSpy).toHaveBeenCalledWith(
			{ method: 'eth_getStorageAt' },
			'First storage request detected, triggering prefetch',
		)

		// Prefetch should be called with the access list
		expect(prefetchSpy).toHaveBeenCalledWith(client, accessList)
	})

	it('should trigger prefetching on first eth_getProof call', async () => {
		const client = createTevmNode()

		// Create a client with a mock transport
		const originalRequest = vi.fn().mockResolvedValue({ result: 'test' })
		// @ts-expect-error
		client.forkTransport = { request: originalRequest }

		// Mock prefetchStorageFromAccessList to track calls
		const prefetchSpy = vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList').mockResolvedValue(undefined)

		// Create a test access list
		const accessList = new Map([
			[
				'0x1111111111111111111111111111111111111111',
				new Set(['0x0000000000000000000000000000000000000000000000000000000000000001']),
			],
		])

		// Set up the proxy
		await setupPrefetchProxy(client, accessList)

		// Make a proof-related request
		const proofRequest = {
			method: 'eth_getProof',
			params: ['0x1111111111111111111111111111111111111111', ['0x0'], 'latest'],
		}
		await client.forkTransport.request(proofRequest)

		// Original request should be called
		expect(originalRequest).toHaveBeenCalledWith(proofRequest)

		// Prefetch should be called with the access list
		expect(prefetchSpy).toHaveBeenCalledWith(client, accessList)
	})

	it('should only trigger prefetching once', async () => {
		const client = createTevmNode()

		// Create a client with a mock transport
		const originalRequest = vi.fn().mockResolvedValue({ result: 'test' })
		// @ts-expect-error
		client.forkTransport = { request: originalRequest }

		// Mock prefetchStorageFromAccessList to track calls
		const prefetchSpy = vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList').mockResolvedValue(undefined)

		// Create a test access list
		const accessList = new Map([
			[
				'0x1111111111111111111111111111111111111111',
				new Set(['0x0000000000000000000000000000000000000000000000000000000000000001']),
			],
		])

		// Set up the proxy
		await setupPrefetchProxy(client, accessList)

		// Make multiple storage-related requests
		const storageRequest = {
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		}

		// First request should trigger prefetching
		await client.forkTransport.request(storageRequest)
		expect(prefetchSpy).toHaveBeenCalledTimes(1)

		// Second request should not trigger prefetching again
		await client.forkTransport.request(storageRequest)
		expect(prefetchSpy).toHaveBeenCalledTimes(1)

		// Third request with different method should still not trigger prefetching
		await client.forkTransport.request({
			method: 'eth_getProof',
			params: ['0x1111111111111111111111111111111111111111', ['0x0'], 'latest'],
		})
		expect(prefetchSpy).toHaveBeenCalledTimes(1)
	})

	it('should handle errors during prefetching', async () => {
		const client = createTevmNode()

		// Mock error logger
		const errorSpy = vi.spyOn(client.logger, 'error')

		// Create a client with a mock transport
		const originalRequest = vi.fn().mockResolvedValue({ result: 'test' })
		// @ts-expect-error
		client.forkTransport = { request: originalRequest }

		// Mock prefetchStorageFromAccessList to throw an error
		vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList').mockRejectedValue(new Error('Prefetch error'))

		// Create a test access list
		const accessList = new Map([
			[
				'0x1111111111111111111111111111111111111111',
				new Set(['0x0000000000000000000000000000000000000000000000000000000000000001']),
			],
		])

		// Set up the proxy
		await setupPrefetchProxy(client, accessList)

		// Make a storage-related request
		const storageRequest = {
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		}

		// Should not throw even though prefetching fails
		const result = await client.forkTransport.request(storageRequest)

		// Original request should still work
		expect(result).toEqual({ result: 'test' })

		// Error log should be called
		expect(errorSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				error: expect.objectContaining({
					message: 'Prefetch error',
				}),
			}),
			'Error during storage prefetching after first storage request',
		)
	})
})
