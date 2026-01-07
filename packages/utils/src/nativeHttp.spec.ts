import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nativeHttp } from './nativeHttp.js'

// Mock HttpProvider
vi.mock('@tevm/voltaire/provider', () => ({
	HttpProvider: vi.fn().mockImplementation((options) => ({
		url: options.url,
		request: vi.fn().mockResolvedValue('0x123'),
	})),
}))

describe('nativeHttp', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should create a transport factory function', () => {
		const transportFactory = nativeHttp('https://example.com')
		expect(typeof transportFactory).toBe('function')
	})

	it('should return a transport with request function when called', () => {
		const transportFactory = nativeHttp('https://example.com')
		const transport = transportFactory()
		expect(transport).toHaveProperty('request')
		expect(typeof transport.request).toBe('function')
	})

	it('should call HttpProvider with correct options', async () => {
		const { HttpProvider } = await import('@tevm/voltaire/provider')

		const url = 'https://mainnet.optimism.io'
		const config = {
			timeout: 60000,
			retryCount: 5,
			retryDelay: 2000,
			headers: { Authorization: 'Bearer token' },
		}

		const transportFactory = nativeHttp(url, config)
		transportFactory()

		expect(HttpProvider).toHaveBeenCalledWith({
			url,
			timeout: 60000,
			retry: 5,
			retryDelay: 2000,
			headers: { Authorization: 'Bearer token' },
		})
	})

	it('should use default config values', async () => {
		const { HttpProvider } = await import('@tevm/voltaire/provider')

		const url = 'https://example.com'
		const transportFactory = nativeHttp(url)
		transportFactory()

		// Headers is not included when not provided (due to conditional assignment)
		expect(HttpProvider).toHaveBeenCalledWith({
			url,
			timeout: 30000,
			retry: 3,
			retryDelay: 1000,
		})
	})

	it('should forward request calls to HttpProvider', async () => {
		const { HttpProvider } = await import('@tevm/voltaire/provider')
		const mockRequest = vi.fn().mockResolvedValue('0xabc')
		;(HttpProvider as any).mockImplementation(() => ({
			request: mockRequest,
		}))

		const transportFactory = nativeHttp('https://example.com')
		const transport = transportFactory()

		const result = await transport.request({
			method: 'eth_blockNumber',
			params: [],
		})

		expect(mockRequest).toHaveBeenCalledWith({
			method: 'eth_blockNumber',
			params: [],
		})
		expect(result).toBe('0xabc')
	})

	it('should handle requests without params', async () => {
		const { HttpProvider } = await import('@tevm/voltaire/provider')
		const mockRequest = vi.fn().mockResolvedValue('0x1')
		;(HttpProvider as any).mockImplementation(() => ({
			request: mockRequest,
		}))

		const transportFactory = nativeHttp('https://example.com')
		const transport = transportFactory()

		await transport.request({ method: 'eth_chainId' })

		expect(mockRequest).toHaveBeenCalledWith({
			method: 'eth_chainId',
			params: [],
		})
	})
})
