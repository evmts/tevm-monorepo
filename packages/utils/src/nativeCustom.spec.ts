import { describe, it, expect, vi } from 'vitest'
import { nativeCustom } from './nativeCustom.js'

describe('nativeCustom', () => {
	it('should create a transport from an EIP-1193 provider', () => {
		const mockProvider = {
			request: vi.fn(),
		}

		const factory = nativeCustom(mockProvider)
		expect(typeof factory).toBe('function')

		const transport = factory()
		expect(transport).toHaveProperty('request')
		expect(transport).toHaveProperty('type', 'custom')
		expect(transport).toHaveProperty('key', 'custom')
		expect(transport).toHaveProperty('name', 'Custom Provider')
	})

	it('should use custom key and name from config', () => {
		const mockProvider = {
			request: vi.fn(),
		}

		const transport = nativeCustom(mockProvider, {
			key: 'my-provider',
			name: 'My Custom Provider',
		})()

		expect(transport.key).toBe('my-provider')
		expect(transport.name).toBe('My Custom Provider')
	})

	it('should forward requests to the provider', async () => {
		const mockProvider = {
			request: vi.fn().mockResolvedValue('0x1234'),
		}

		const transport = nativeCustom(mockProvider)()

		const result = await transport.request({
			method: 'eth_blockNumber',
			params: [],
		})

		expect(result).toBe('0x1234')
		expect(mockProvider.request).toHaveBeenCalledWith({
			method: 'eth_blockNumber',
			params: [],
		})
	})

	it('should handle requests without params', async () => {
		const mockProvider = {
			request: vi.fn().mockResolvedValue('0x5'),
		}

		const transport = nativeCustom(mockProvider)()

		const result = await transport.request({
			method: 'eth_chainId',
		})

		expect(result).toBe('0x5')
		expect(mockProvider.request).toHaveBeenCalledWith({
			method: 'eth_chainId',
			params: [],
		})
	})

	it('should throw if provider is missing', () => {
		// @ts-expect-error - testing invalid input
		expect(() => nativeCustom(null)).toThrow('nativeCustom requires an EIP-1193 provider')
	})

	it('should throw if provider has no request method', () => {
		// @ts-expect-error - testing invalid input
		expect(() => nativeCustom({})).toThrow('nativeCustom requires an EIP-1193 provider')
	})

	it('should retry on transient errors', async () => {
		let attempts = 0
		const mockProvider = {
			request: vi.fn().mockImplementation(async () => {
				attempts++
				if (attempts < 2) {
					throw new Error('Network error')
				}
				return '0x1'
			}),
		}

		const transport = nativeCustom(mockProvider, {
			retryCount: 3,
			retryDelay: 10,
		})()

		const result = await transport.request({ method: 'eth_chainId' })

		expect(result).toBe('0x1')
		expect(attempts).toBe(2)
	})

	it('should not retry on user rejection errors (code 4001)', async () => {
		const mockProvider = {
			request: vi.fn().mockRejectedValue({ code: 4001, message: 'User rejected' }),
		}

		const transport = nativeCustom(mockProvider, {
			retryCount: 3,
			retryDelay: 10,
		})()

		await expect(transport.request({ method: 'eth_sendTransaction' })).rejects.toEqual({
			code: 4001,
			message: 'User rejected',
		})

		expect(mockProvider.request).toHaveBeenCalledTimes(1)
	})

	it('should not retry on invalid params errors (code -32602)', async () => {
		const mockProvider = {
			request: vi.fn().mockRejectedValue({ code: -32602, message: 'Invalid params' }),
		}

		const transport = nativeCustom(mockProvider, {
			retryCount: 3,
			retryDelay: 10,
		})()

		await expect(transport.request({ method: 'eth_call' })).rejects.toEqual({
			code: -32602,
			message: 'Invalid params',
		})

		expect(mockProvider.request).toHaveBeenCalledTimes(1)
	})

	it('should exhaust retries and throw last error', async () => {
		const mockProvider = {
			request: vi.fn().mockRejectedValue(new Error('Persistent error')),
		}

		const transport = nativeCustom(mockProvider, {
			retryCount: 2,
			retryDelay: 10,
		})()

		await expect(transport.request({ method: 'eth_chainId' })).rejects.toThrow('Persistent error')

		// Initial attempt + 2 retries = 3 total calls
		expect(mockProvider.request).toHaveBeenCalledTimes(3)
	})

	it('should work with default retry settings', async () => {
		let attempts = 0
		const mockProvider = {
			request: vi.fn().mockImplementation(async () => {
				attempts++
				if (attempts < 2) {
					throw new Error('Transient error')
				}
				return '0x1'
			}),
		}

		const transport = nativeCustom(mockProvider)()

		const result = await transport.request({ method: 'eth_chainId' })

		expect(result).toBe('0x1')
		expect(attempts).toBe(2)
	})
})
