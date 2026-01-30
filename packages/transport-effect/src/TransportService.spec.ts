import { describe, it, expect } from 'vitest'
import { Effect, Layer, Context } from 'effect'
import { TransportService } from './TransportService.js'
import type { TransportShape } from './types.js'

describe('TransportService', () => {
	describe('Context.Tag', () => {
		it('should be a valid Context.Tag', () => {
			expect(TransportService).toBeDefined()
			expect(TransportService.key).toBe('@tevm/transport-effect/TransportService')
		})

		it('should be usable in Effect.gen for dependency injection', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string, params?: unknown[]) =>
					Effect.succeed('0x1' as T),
			}

			const testLayer = Layer.succeed(TransportService, mockTransport)

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return transport
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(mockTransport)
		})

		it('should allow making requests through the service', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string, params?: unknown[]) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0xa' as T) // Chain ID 10
					}
					return Effect.succeed('0x0' as T)
				},
			}

			const testLayer = Layer.succeed(TransportService, mockTransport)

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				const chainIdHex = yield* transport.request<string>('eth_chainId')
				return BigInt(chainIdHex)
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(10n)
		})

		it('should support request with parameters', async () => {
			let capturedMethod: string | undefined
			let capturedParams: unknown[] | undefined

			const mockTransport: TransportShape = {
				request: <T>(method: string, params?: unknown[]) => {
					capturedMethod = method
					capturedParams = params
					return Effect.succeed('0xde0b6b3a7640000' as T) // 1 ETH in wei
				},
			}

			const testLayer = Layer.succeed(TransportService, mockTransport)

			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				const balance = yield* transport.request<string>('eth_getBalance', [
					'0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73',
					'latest',
				])
				return BigInt(balance)
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(1000000000000000000n)
			expect(capturedMethod).toBe('eth_getBalance')
			expect(capturedParams).toEqual([
				'0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73',
				'latest',
			])
		})
	})
})
