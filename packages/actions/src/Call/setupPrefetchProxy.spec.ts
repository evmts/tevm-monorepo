import { createTevmNode } from '@tevm/node'
import { createAddress } from '@tevm/address'
import { bytesToHex } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as prefetchModule from './prefetchStorageFromAccessList.js'
import { setupPrefetchProxy } from './setupPrefetchProxy.js'

describe('setupPrefetchProxy', () => {
	beforeEach(() => {
		// Reset mocks before each test
		vi.restoreAllMocks()
	})

	it('should do nothing if client has no forkTransport', async () => {
		const client = createTevmNode()

		// Ensure client has no forkTransport
		// @ts-expect-error
		client.forkTransport = undefined

		const result = setupPrefetchProxy(client, {}, {})
		expect(result).toBe(client)
	})

	it('should proxy the original request function', async () => {
		const client = createTevmNode()

		// Create a client with a mock transport
		const originalResult = { result: 'test' }
		const originalRequest = vi.fn().mockResolvedValue(originalResult)
		// @ts-expect-error
		client.forkTransport = { request: originalRequest }

		// Set up the proxy
		setupPrefetchProxy(client, {}, {})

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
		const originalRequest = vi.fn()
			.mockImplementation(async (request) => {
				if (request.method === 'eth_createAccessList') {
					return {
						accessList: [
							{
								address: '0x1111111111111111111111111111111111111111',
								storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
							},
						],
					}
				}
				return { result: 'test' }
			})

		// Mock getVm
		const mockVm = {
			blockchain: {
				blocksByTag: new Map([['forked', { header: { number: '0x100' } }]]),
				getBlockByTag: vi.fn().mockResolvedValue({ header: { number: '0x100' } }),
			},
		}

		// @ts-expect-error
		client.forkTransport = { request: originalRequest }
		// @ts-expect-error
		client.getVm = vi.fn().mockResolvedValue(mockVm)

		// Mock prefetchStorageFromAccessList to track calls
		const prefetchSpy = vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList').mockResolvedValue(undefined)

		// Set up the proxy with evmInput
		const evmInput = {
			caller: createAddress('0x1234567890123456789012345678901234567890'),
			to: createAddress('0x2345678901234567890123456789012345678901'),
			data: new Uint8Array([1, 2, 3, 4]),
		}

		setupPrefetchProxy(client, evmInput, {})

		// Make a storage-related request
		const storageRequest = {
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		}
		await client.forkTransport.request(storageRequest)

		// Original request should be called for both the storage request and createAccessList
		expect(originalRequest).toHaveBeenCalledWith(storageRequest)
		expect(originalRequest).toHaveBeenCalledWith(expect.objectContaining({
			method: 'eth_createAccessList',
			params: expect.arrayContaining([
				expect.objectContaining({
					from: '0x1234567890123456789012345678901234567890',
					to: '0x2345678901234567890123456789012345678901',
					data: bytesToHex(new Uint8Array([1, 2, 3, 4])),
				}),
			]),
		}))

		// Debug log should be called - just check that it's called, not the specific params
		expect(debugSpy).toHaveBeenCalledWith(
			"First storage request detected, triggering prefetch",
		)

		// Prefetch should be called with the access list result
		expect(prefetchSpy).toHaveBeenCalledWith(
			client,
			expect.objectContaining({
				accessList: expect.arrayContaining([
					expect.objectContaining({
						address: '0x1111111111111111111111111111111111111111',
					}),
				]),
			}),
		)
	})

	it('should trigger prefetching on first eth_getProof call', async () => {
		const client = createTevmNode()

		// Create a client with a mock transport
		const originalRequest = vi.fn()
			.mockImplementation(async (request) => {
				if (request.method === 'eth_createAccessList') {
					return {
						accessList: [
							{
								address: '0x1111111111111111111111111111111111111111',
								storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
							},
						],
					}
				}
				return { result: 'test' }
			})

		// Mock getVm
		const mockVm = {
			blockchain: {
				blocksByTag: new Map([['forked', { header: { number: '0x100' } }]]),
				getBlockByTag: vi.fn().mockResolvedValue({ header: { number: '0x100' } }),
			},
		}

		// @ts-expect-error
		client.forkTransport = { request: originalRequest }
		// @ts-expect-error
		client.getVm = vi.fn().mockResolvedValue(mockVm)

		// Mock prefetchStorageFromAccessList to track calls
		const prefetchSpy = vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList').mockResolvedValue(undefined)

		// Set up the proxy
		setupPrefetchProxy(client, {}, {})

		// Make a proof-related request
		const proofRequest = {
			method: 'eth_getProof',
			params: ['0x1111111111111111111111111111111111111111', ['0x0'], 'latest'],
		}
		await client.forkTransport.request(proofRequest)

		// Original request should be called
		expect(originalRequest).toHaveBeenCalledWith(proofRequest)

		// Prefetch should be called with the access list
		expect(prefetchSpy).toHaveBeenCalled()
	})

	it('should only trigger prefetching once', async () => {
		const client = createTevmNode()

		// Create a client with a mock transport
		const originalRequest = vi.fn()
			.mockImplementation(async (request) => {
				if (request.method === 'eth_createAccessList') {
					return {
						accessList: [
							{
								address: '0x1111111111111111111111111111111111111111',
								storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
							},
						],
					}
				}
				return { result: 'test' }
			})

		// Mock getVm
		const mockVm = {
			blockchain: {
				blocksByTag: new Map([['forked', { header: { number: '0x100' } }]]),
				getBlockByTag: vi.fn().mockResolvedValue({ header: { number: '0x100' } }),
			},
		}

		// @ts-expect-error
		client.forkTransport = { request: originalRequest }
		// @ts-expect-error
		client.getVm = vi.fn().mockResolvedValue(mockVm)

		// Mock prefetchStorageFromAccessList to track calls
		const prefetchSpy = vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList').mockResolvedValue(undefined)

		// Set up the proxy
		setupPrefetchProxy(client, {}, {})

		// Make multiple storage-related requests
		const storageRequest = {
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		}

		// Reset counts for createAccessList requests
		originalRequest.mockClear();

		// First request should trigger prefetching
		await client.forkTransport.request(storageRequest)
		expect(prefetchSpy).toHaveBeenCalledTimes(1)
		expect(originalRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'eth_createAccessList' }))

		// Reset counts
		originalRequest.mockClear();
		prefetchSpy.mockClear();

		// Second request should not trigger prefetching again
		await client.forkTransport.request(storageRequest)
		expect(prefetchSpy).not.toHaveBeenCalled()
		expect(originalRequest).not.toHaveBeenCalledWith(expect.objectContaining({ method: 'eth_createAccessList' }))

		// Third request with different method should still not trigger prefetching
		await client.forkTransport.request({
			method: 'eth_getProof',
			params: ['0x1111111111111111111111111111111111111111', ['0x0'], 'latest'],
		})
		expect(prefetchSpy).not.toHaveBeenCalled()
		expect(originalRequest).not.toHaveBeenCalledWith(expect.objectContaining({ method: 'eth_createAccessList' }))
	})

	it('should handle errors during prefetching', async () => {
		const client = createTevmNode()

		// Mock error logger
		const errorSpy = vi.spyOn(client.logger, 'error')

		// Create a client with a mock transport
		const originalRequest = vi.fn()
			.mockImplementation(async (request) => {
				if (request.method === 'eth_createAccessList') {
					return {
						accessList: [
							{
								address: '0x1111111111111111111111111111111111111111',
								storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
							},
						],
					}
				}
				return { result: 'test' }
			})

		// Mock getVm
		const mockVm = {
			blockchain: {
				blocksByTag: new Map([['forked', { header: { number: '0x100' } }]]),
				getBlockByTag: vi.fn().mockResolvedValue({ header: { number: '0x100' } }),
			},
		}

		// @ts-expect-error
		client.forkTransport = { request: originalRequest }
		// @ts-expect-error
		client.getVm = vi.fn().mockResolvedValue(mockVm)

		// Mock prefetchStorageFromAccessList to throw an error
		vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList').mockRejectedValue(new Error('Prefetch error'))

		// Set up the proxy
		setupPrefetchProxy(client, {}, {})

		// Make a storage-related request
		const storageRequest = {
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		}

		// Should not throw even though prefetching fails
		const result = await client.forkTransport.request(storageRequest)

		// Original request should still work
		expect(result).toEqual({ result: 'test' })

		// Give the error handling promise time to execute
		await new Promise(resolve => setTimeout(resolve, 10))

		// Check that the error was logged correctly
		expect(errorSpy).toHaveBeenCalled()
		expect(errorSpy.mock.calls.length).toBeGreaterThan(0)
		expect(errorSpy.mock.calls[0]?.[1]).toBe('Error during storage prefetching after first storage request')
	})

	it('should reject if eth_createAccessList returns no access list', async () => {
		const client = createTevmNode()

		// Create a client with a mock transport that returns null for createAccessList
		const originalRequest = vi.fn()
			.mockImplementation(async (request) => {
				if (request.method === 'eth_createAccessList') {
					return null; // Simulate no access list returned
				}
				return { result: 'test' }
			})

		// Mock getVm
		const mockVm = {
			blockchain: {
				blocksByTag: new Map([['forked', { header: { number: '0x100' } }]]),
				getBlockByTag: vi.fn().mockResolvedValue({ header: { number: '0x100' } }),
			},
		}

		// @ts-expect-error
		client.forkTransport = { request: originalRequest }
		// @ts-expect-error
		client.getVm = vi.fn().mockResolvedValue(mockVm)

		// Debug logger
		const debugSpy = vi.spyOn(client.logger, 'debug')

        // Error logger
        const errorSpy = vi.spyOn(client.logger, 'error')

		// Mock prefetchStorageFromAccessList to track calls
		const prefetchSpy = vi.spyOn(prefetchModule, 'prefetchStorageFromAccessList')

		// Set up the proxy
		setupPrefetchProxy(client, {}, {})

		// Make a storage-related request
		const storageRequest = {
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		}

		// Should not throw
		await client.forkTransport.request(storageRequest)

		// Give the async operations time to complete
		await new Promise(resolve => setTimeout(resolve, 10))

		// Prefetch should not have been called since there was no access list
		expect(prefetchSpy).not.toHaveBeenCalled()

		// Debug log should still indicate prefetch attempt - just check that it's called
		expect(debugSpy).toHaveBeenCalledWith(
			"First storage request detected, triggering prefetch",
		)

        // Check that the error was properly logged
        expect(errorSpy).toHaveBeenCalledWith(
            "Unexpected no access list returned from eth_createAccessList"
        )
	})

	it('should use the forked block number when no block tag specified', async () => {
		const client = createTevmNode()
		const forkedBlockNumber = '0x100'
		let capturedParams: any = null;

		// Create a client with a mock transport
		const originalRequest = vi.fn()
			.mockImplementation(async (request) => {
				if (request.method === 'eth_createAccessList') {
					capturedParams = request.params;
					return {
						accessList: [
							{
								address: '0x1111111111111111111111111111111111111111',
								storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
							},
						],
					}
				}
				return { result: 'test' }
			})

		// Mock getVm and setup client
		const mockVm = {
			blockchain: {
				blocksByTag: new Map([['forked', { header: { number: forkedBlockNumber } }]]),
				getBlockByTag: vi.fn().mockResolvedValue({ header: { number: forkedBlockNumber } }),
			},
		}
		// @ts-expect-error
		client.forkTransport = { request: originalRequest }
		// @ts-expect-error
		client.getVm = vi.fn().mockResolvedValue(mockVm)

		// Setup and trigger prefetch
		setupPrefetchProxy(client, {}, {})
		await client.forkTransport.request({
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		})

		// Verify that the second param is the forked block number
		expect(capturedParams[1]).toBe(forkedBlockNumber)
	})

	it('should use the requested block number when specified and within forked range', async () => {
		const client = createTevmNode()
		const forkedBlockNumber = '0x200'
		const requestedBlockNumber = '0x100'
		let capturedParams: any = null;

		// Create a client with a mock transport
		const originalRequest = vi.fn()
			.mockImplementation(async (request) => {
				if (request.method === 'eth_createAccessList') {
					// Store the params for verification
					capturedParams = request.params;
					return {
						accessList: [
							{
								address: '0x1111111111111111111111111111111111111111',
								storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
							},
						],
					}
				}
				return { result: 'test' }
			})

		// Mock getVm
		const mockVm = {
			blockchain: {
				blocksByTag: new Map([
					['forked', { header: { number: forkedBlockNumber } }],
				]),
				getBlockByTag: vi.fn().mockImplementation(async (tag) => {
					if (tag === 'requested') {
						return { header: { number: requestedBlockNumber } }
					}
					return { header: { number: forkedBlockNumber } }
				}),
			},
		}

		// @ts-expect-error
		client.forkTransport = { request: originalRequest }
		// @ts-expect-error
		client.getVm = vi.fn().mockResolvedValue(mockVm)

		// Set up the proxy with blockTag in params
		// @ts-expect-error - 'requested' is not a valid BlockParam but we're mocking for test
		setupPrefetchProxy(client, {}, { blockTag: 'requested' })

		// Make a storage-related request to trigger prefetching
		await client.forkTransport.request({
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		})

		// Verify against the captured params instead of the mock function
		expect(capturedParams[1]).toBe(requestedBlockNumber)
	})

	it('should use the forked block number when requested block is higher than forked block', async () => {
		const client = createTevmNode()
		const forkedBlockNumber = '0x100'
		const requestedBlockNumber = '0x200'
		let capturedParams: any = null;

		// Create a client with a mock transport
		const originalRequest = vi.fn()
			.mockImplementation(async (request) => {
				if (request.method === 'eth_createAccessList') {
					// Store the params for verification
					capturedParams = request.params;
					return {
						accessList: [
							{
								address: '0x1111111111111111111111111111111111111111',
								storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
							},
						],
					}
				}
				return { result: 'test' }
			})

		// Mock getVm
		const mockVm = {
			blockchain: {
				blocksByTag: new Map([
					['forked', { header: { number: forkedBlockNumber } }],
				]),
				getBlockByTag: vi.fn().mockImplementation(async (tag) => {
					if (tag === 'requested') {
						return { header: { number: requestedBlockNumber } }
					}
					return { header: { number: forkedBlockNumber } }
				}),
			},
		}

		// @ts-expect-error
		client.forkTransport = { request: originalRequest }
		// @ts-expect-error
		client.getVm = vi.fn().mockResolvedValue(mockVm)

		// Set up the proxy with blockTag in params
		// @ts-expect-error - 'requested' is not a valid BlockParam but we're mocking for test
		setupPrefetchProxy(client, {}, { blockTag: 'requested' })

		// Make a storage-related request to trigger prefetching
		await client.forkTransport.request({
			method: 'eth_getStorageAt',
			params: ['0x1111111111111111111111111111111111111111', '0x0', 'latest'],
		})

		// Verify that the second param in createAccessList call is the forked block number
		// (since requested block is higher)
		expect(capturedParams[1]).toBe(forkedBlockNumber)
	})
})
