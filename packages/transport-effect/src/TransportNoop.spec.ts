import { ForkError } from '@tevm/errors-effect'
import { Effect, Exit } from 'effect'
import { describe, expect, it } from 'vitest'
import { TransportNoop } from './TransportNoop.js'
import { TransportService } from './TransportService.js'

describe('TransportNoop', () => {
	describe('Layer', () => {
		it('should be a valid Layer', () => {
			expect(TransportNoop).toBeDefined()
		})

		it('should provide TransportService', async () => {
			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return transport
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(TransportNoop)))
			expect(result).toBeDefined()
			expect(typeof result.request).toBe('function')
		})
	})

	describe('request method', () => {
		it('should fail with ForkError for any method', async () => {
			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(TransportNoop)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const error = result.cause._tag === 'Fail' ? result.cause.error : null
				expect(error).toBeInstanceOf(ForkError)
				expect((error as ForkError).method).toBe('eth_chainId')
				// ForkError generates message from method, cause contains the reason
				expect((error as ForkError).message).toContain('eth_chainId')
				expect(((error as ForkError).cause as Error).message).toBe('No fork transport configured')
			}
		})

		it('should fail with ForkError for eth_blockNumber', async () => {
			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_blockNumber')
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(TransportNoop)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const error = result.cause._tag === 'Fail' ? result.cause.error : null
				expect((error as ForkError).method).toBe('eth_blockNumber')
			}
		})

		it('should fail with ForkError for eth_getBalance with params', async () => {
			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_getBalance', ['0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73', 'latest'])
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(TransportNoop)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const error = result.cause._tag === 'Fail' ? result.cause.error : null
				expect((error as ForkError).method).toBe('eth_getBalance')
			}
		})

		it('should include the method name in the error', async () => {
			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('custom_method')
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(TransportNoop)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const error = result.cause._tag === 'Fail' ? result.cause.error : null
				expect((error as ForkError).method).toBe('custom_method')
			}
		})

		it('should be catchable with Effect.catchTag', async () => {
			const program = Effect.gen(function* () {
				const transport = yield* TransportService
				return yield* transport.request('eth_chainId')
			}).pipe(
				Effect.catchTag('ForkError', (error) => {
					return Effect.succeed({ caught: true, method: error.method })
				}),
			)

			const result = await Effect.runPromise(program.pipe(Effect.provide(TransportNoop)))

			expect(result).toEqual({ caught: true, method: 'eth_chainId' })
		})
	})
})
