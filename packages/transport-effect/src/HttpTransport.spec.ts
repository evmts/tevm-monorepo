import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Effect, Exit } from 'effect'
import { HttpTransport } from './HttpTransport.js'
import { TransportService } from './TransportService.js'
import { ForkError } from '@tevm/errors-effect'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('HttpTransport', () => {
	beforeEach(() => {
		mockFetch.mockReset()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('Layer creation', () => {
		it('should create a valid Layer', () => {
			const layer = HttpTransport({ url: 'https://example.com' })
			expect(layer).toBeDefined()
		})

		it('should provide TransportService', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x1' }),
			})

			const layer = HttpTransport({ url: 'https://example.com' })

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return transport
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBeDefined()
			expect(typeof result.request).toBe('function')
		})
	})

	describe('request method', () => {
		it('should make successful JSON-RPC requests', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ jsonrpc: '2.0', id: 1, result: '0xa' }),
			})

			const layer = HttpTransport({ url: 'https://example.com' })

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request<string>('eth_chainId')
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe('0xa')
		})

		it('should include correct JSON-RPC payload', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x1' }),
			})

			const layer = HttpTransport({ url: 'https://example.com' })

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_getBalance', ['0x123', 'latest'])
			})

			await Effect.runPromise(program.pipe(Effect.provide(layer)))

			expect(mockFetch).toHaveBeenCalledWith(
				'https://example.com',
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						'Content-Type': 'application/json',
					}),
					body: expect.stringContaining('"method":"eth_getBalance"'),
				})
			)

			const body = JSON.parse(mockFetch.mock.calls[0][1].body)
			expect(body).toMatchObject({
				jsonrpc: '2.0',
				method: 'eth_getBalance',
				params: ['0x123', 'latest'],
			})
		})

		it('should handle empty params', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ jsonrpc: '2.0', id: 1, result: '0xa' }),
			})

			const layer = HttpTransport({ url: 'https://example.com' })

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			})

			await Effect.runPromise(program.pipe(Effect.provide(layer)))

			const body = JSON.parse(mockFetch.mock.calls[0][1].body)
			expect(body.params).toEqual([])
		})

		it('should include custom headers', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x1' }),
			})

			const layer = HttpTransport({
				url: 'https://example.com',
				headers: { Authorization: 'Bearer token123' },
			})

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			})

			await Effect.runPromise(program.pipe(Effect.provide(layer)))

			expect(mockFetch).toHaveBeenCalledWith(
				'https://example.com',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer token123',
					}),
				})
			)
		})
	})

	describe('error handling', () => {
		it('should fail with ForkError on HTTP error', async () => {
			// Mock to always fail for retry testing
			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			})

			const layer = HttpTransport({
				url: 'https://example.com',
				retryCount: 0, // No retries for faster test
			})

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const error = result.cause._tag === 'Fail' ? result.cause.error : null
				expect(error).toBeInstanceOf(ForkError)
				expect((error as ForkError).method).toBe('eth_chainId')
			}
		})

		it('should fail with ForkError on RPC error response', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({
					jsonrpc: '2.0',
					id: 1,
					error: { code: -32600, message: 'Invalid Request' },
				}),
			})

			const layer = HttpTransport({
				url: 'https://example.com',
				retryCount: 0,
			})

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('invalid_method')
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const error = result.cause._tag === 'Fail' ? result.cause.error : null
				expect(error).toBeInstanceOf(ForkError)
				expect((error as ForkError).method).toBe('invalid_method')
				// ForkError generates message from method, cause contains the RPC error
				expect(((error as ForkError).cause as Error).message).toContain('Invalid Request')
			}
		})

		it('should fail with ForkError on network error', async () => {
			mockFetch.mockRejectedValue(new Error('Network error'))

			const layer = HttpTransport({
				url: 'https://example.com',
				retryCount: 0,
			})

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const error = result.cause._tag === 'Fail' ? result.cause.error : null
				expect(error).toBeInstanceOf(ForkError)
			}
		})

		it('should be catchable with Effect.catchTag', async () => {
			mockFetch.mockRejectedValue(new Error('Network error'))

			const layer = HttpTransport({
				url: 'https://example.com',
				retryCount: 0,
			})

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			}).pipe(
				Effect.catchTag('ForkError', (error) => {
					return Effect.succeed({ caught: true, method: error.method })
				})
			)

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toEqual({ caught: true, method: 'eth_chainId' })
		})
	})

	describe('retry behavior', () => {
		it('should retry on failure', async () => {
			// Fail first, succeed second
			mockFetch
				.mockRejectedValueOnce(new Error('First failure'))
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x1' }),
				})

			const layer = HttpTransport({
				url: 'https://example.com',
				retryCount: 2,
				retryDelay: 10, // Short delay for testing
			})

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe('0x1')
			expect(mockFetch).toHaveBeenCalledTimes(2)
		})
	})

	describe('configuration', () => {
		it('should use default timeout when not specified', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x1' }),
			})

			const layer = HttpTransport({ url: 'https://example.com' })

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			})

			await Effect.runPromise(program.pipe(Effect.provide(layer)))

			// Verify fetch was called with an abort signal
			expect(mockFetch).toHaveBeenCalledWith(
				'https://example.com',
				expect.objectContaining({
					signal: expect.any(AbortSignal),
				})
			)
		})

		it('should handle non-Error rejection values', async () => {
			mockFetch.mockRejectedValue('string error')

			const layer = HttpTransport({
				url: 'https://example.com',
				retryCount: 0,
			})

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const error = result.cause._tag === 'Fail' ? result.cause.error : null
				expect(error).toBeInstanceOf(ForkError)
			}
		})
	})
})
