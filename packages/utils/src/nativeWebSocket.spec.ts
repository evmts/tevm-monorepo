import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nativeWebSocket } from './nativeWebSocket.js'

// Mock WebSocketProvider
const mockConnect = vi.fn().mockResolvedValue(undefined)
const mockDisconnect = vi.fn()
const mockRequest = vi.fn().mockResolvedValue('0x123')
const mockSubscribe = vi.fn().mockResolvedValue('0xsubscriptionId')
const mockUnsubscribe = vi.fn().mockResolvedValue(true)
const mockOn = vi.fn()

vi.mock('@tevm/voltaire/provider', () => ({
	WebSocketProvider: vi.fn().mockImplementation((options) => ({
		url: options.url,
		connect: mockConnect,
		disconnect: mockDisconnect,
		request: mockRequest,
		subscribe: mockSubscribe,
		unsubscribe: mockUnsubscribe,
		on: mockOn,
	})),
}))

describe('nativeWebSocket', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should create a transport factory function', () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		expect(typeof transportFactory).toBe('function')
	})

	it('should return a transport with required methods when called', () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		const transport = transportFactory()
		expect(transport).toHaveProperty('request')
		expect(transport).toHaveProperty('connect')
		expect(transport).toHaveProperty('disconnect')
		expect(transport).toHaveProperty('subscribe')
		expect(transport).toHaveProperty('unsubscribe')
		expect(typeof transport.request).toBe('function')
		expect(typeof transport.connect).toBe('function')
		expect(typeof transport.disconnect).toBe('function')
		expect(typeof transport.subscribe).toBe('function')
		expect(typeof transport.unsubscribe).toBe('function')
	})

	it('should call WebSocketProvider with correct options', async () => {
		const { WebSocketProvider } = await import('@tevm/voltaire/provider')

		const url = 'wss://mainnet.infura.io/ws/v3/KEY'
		const config = {
			timeout: 60000,
			reconnect: false,
			reconnectDelay: 3000,
			maxReconnectAttempts: 5,
			protocols: 'graphql-ws',
		}

		const transportFactory = nativeWebSocket(url, config)
		transportFactory()

		expect(WebSocketProvider).toHaveBeenCalledWith({
			url,
			reconnect: false,
			reconnectDelay: 3000,
			maxReconnectAttempts: 5,
			protocols: 'graphql-ws',
		})
	})

	it('should use default config values', async () => {
		const { WebSocketProvider } = await import('@tevm/voltaire/provider')

		const url = 'wss://example.com'
		const transportFactory = nativeWebSocket(url)
		transportFactory()

		expect(WebSocketProvider).toHaveBeenCalledWith({
			url,
			reconnect: true,
			reconnectDelay: 5000,
			maxReconnectAttempts: 0,
		})
	})

	it('should forward connect call to WebSocketProvider', async () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		const transport = transportFactory()

		await transport.connect()

		expect(mockConnect).toHaveBeenCalled()
	})

	it('should forward disconnect call to WebSocketProvider', () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		const transport = transportFactory()

		transport.disconnect()

		expect(mockDisconnect).toHaveBeenCalled()
	})

	it('should forward request calls to WebSocketProvider', async () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		const transport = transportFactory()

		const result = await transport.request({
			method: 'eth_blockNumber',
			params: [],
		})

		expect(mockRequest).toHaveBeenCalledWith({
			method: 'eth_blockNumber',
			params: [],
		})
		expect(result).toBe('0x123')
	})

	it('should handle requests without params', async () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		const transport = transportFactory()

		await transport.request({ method: 'eth_chainId' })

		expect(mockRequest).toHaveBeenCalledWith({
			method: 'eth_chainId',
			params: [],
		})
	})

	it('should forward subscribe calls to WebSocketProvider', async () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		const transport = transportFactory()

		const subscriptionId = await transport.subscribe('newHeads', [])

		expect(mockSubscribe).toHaveBeenCalledWith('newHeads', [])
		expect(subscriptionId).toBe('0xsubscriptionId')
	})

	it('should register callback with provider on subscribe', async () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		const transport = transportFactory()
		const callback = vi.fn()

		await transport.subscribe('newHeads', [], callback)

		expect(mockOn).toHaveBeenCalledWith('0xsubscriptionId', callback)
	})

	it('should forward unsubscribe calls to WebSocketProvider', async () => {
		const transportFactory = nativeWebSocket('wss://example.com')
		const transport = transportFactory()

		const result = await transport.unsubscribe('0xsubscriptionId')

		expect(mockUnsubscribe).toHaveBeenCalledWith('0xsubscriptionId')
		expect(result).toBe(true)
	})
})
