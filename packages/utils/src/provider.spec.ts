import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fetchFromProvider, getProvider } from './provider.js'

describe('getProvider', () => {
	it('should return the URL when given a string', () => {
		const url = 'https://mainnet.infura.io/v3/test-key'
		expect(getProvider(url)).toBe(url)
	})

	it('should extract URL from a Web3Provider object', () => {
		const expectedUrl = 'https://alchemy.io/v2/test-key'
		const provider = {
			_getConnection: () => ({ url: expectedUrl }),
		}
		expect(getProvider(provider)).toBe(expectedUrl)
	})

	it('should throw error for invalid provider', () => {
		expect(() => getProvider(123 as any)).toThrow('Must provide valid provider URL or Web3Provider')
	})

	it('should throw error for null provider', () => {
		expect(() => getProvider(null as any)).toThrow('Must provide valid provider URL or Web3Provider')
	})

	it('should throw error for object without _getConnection', () => {
		const invalidProvider = { someMethod: () => 'test' }
		expect(() => getProvider(invalidProvider as any)).toThrow('Must provide valid provider URL or Web3Provider')
	})
})

describe('fetchFromProvider', () => {
	const originalFetch = globalThis.fetch

	beforeEach(() => {
		vi.resetAllMocks()
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('should make a JSON-RPC request and return result', async () => {
		const mockResult = '0x1234'
		// @ts-expect-error - vi.fn() mock doesn't have preconnect property
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					jsonrpc: '2.0',
					id: 1,
					result: mockResult,
				}),
		})

		const result = await fetchFromProvider('https://rpc.example.com', {
			method: 'eth_blockNumber',
			params: [],
		})

		expect(result).toBe(mockResult)
		expect(fetch).toHaveBeenCalledWith('https://rpc.example.com', {
			headers: {
				'content-type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				method: 'eth_blockNumber',
				params: [],
				jsonrpc: '2.0',
				id: 1,
			}),
		})
	})

	it('should handle request without params', async () => {
		// @ts-expect-error - vi.fn() mock doesn't have preconnect property
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					jsonrpc: '2.0',
					id: 1,
					result: '0x1',
				}),
		})

		const result = await fetchFromProvider('https://rpc.example.com', {
			method: 'eth_chainId',
		})

		expect(result).toBe('0x1')
	})

	it('should throw error when response is not ok', async () => {
		// @ts-expect-error - vi.fn() mock doesn't have preconnect property
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			text: () => Promise.resolve('Internal Server Error'),
		})

		await expect(
			fetchFromProvider('https://rpc.example.com', {
				method: 'eth_blockNumber',
				params: [],
			}),
		).rejects.toThrow('JSONRPCError')
	})

	it('should handle network errors gracefully', async () => {
		// @ts-expect-error - vi.fn() mock doesn't have preconnect property
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 0,
			text: () => Promise.reject(new Error('Network error')),
		})

		await expect(
			fetchFromProvider('https://rpc.example.com', {
				method: 'eth_blockNumber',
				params: [],
			}),
		).rejects.toThrow('JSONRPCError')
	})

	it('should throw error when JSON-RPC returns error', async () => {
		// @ts-expect-error - vi.fn() mock doesn't have preconnect property
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					jsonrpc: '2.0',
					id: 1,
					error: {
						code: -32600,
						message: 'Invalid Request',
					},
				}),
		})

		await expect(
			fetchFromProvider('https://rpc.example.com', {
				method: 'invalid_method',
				params: [],
			}),
		).rejects.toThrow('JSONRPCError')
	})

	it('should include error details in thrown error', async () => {
		// @ts-expect-error - vi.fn() mock doesn't have preconnect property
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					jsonrpc: '2.0',
					id: 1,
					error: {
						code: -32601,
						message: 'Method not found',
					},
				}),
		})

		try {
			await fetchFromProvider('https://rpc.example.com', {
				method: 'unknown_method',
				params: [],
			})
			expect.fail('Should have thrown')
		} catch (error) {
			expect((error as Error).message).toContain('unknown_method')
			expect((error as Error).message).toContain('Method not found')
		}
	})
})
