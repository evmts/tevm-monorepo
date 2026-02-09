import { ForkError } from '@tevm/errors-effect'
import { Effect, Exit, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { ForkConfigFromRpc } from './ForkConfigFromRpc.js'
import { ForkConfigService } from './ForkConfigService.js'
import { TransportService } from './TransportService.js'
import type { TransportShape } from './types.js'

describe('ForkConfigFromRpc', () => {
	describe('Layer', () => {
		it('should be a valid Layer', () => {
			expect(ForkConfigFromRpc).toBeDefined()
		})

		it('should require TransportService', async () => {
			// Create a mock transport that returns valid responses
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0xa' as T) // Chain ID 10
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x75bcd15' as T) // 123456789
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(forkConfigLayer)))
			expect(result).toBeDefined()
		})
	})

	describe('RPC fetching', () => {
		it('should fetch chainId from eth_chainId', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0xa' as T) // Chain ID 10
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x1' as T)
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.chainId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(forkConfigLayer)))
			expect(result).toBe(10n)
		})

		it('should fetch blockTag from eth_blockNumber', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0x1' as T)
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x112a880' as T) // 18000000
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.blockTag
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(forkConfigLayer)))
			expect(result).toBe(18000000n)
		})

		it('should fetch both values in parallel', async () => {
			const calledMethods: string[] = []

			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					calledMethods.push(method)
					if (method === 'eth_chainId') {
						return Effect.succeed('0x1' as T)
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x1' as T)
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config
			})

			await Effect.runPromise(program.pipe(Effect.provide(forkConfigLayer)))

			expect(calledMethods).toContain('eth_chainId')
			expect(calledMethods).toContain('eth_blockNumber')
		})
	})

	describe('error handling', () => {
		it('should fail if eth_chainId request fails', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.fail(new ForkError({ method, cause: new Error('RPC error') }))
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x1' as T)
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(forkConfigLayer)))

			expect(Exit.isFailure(result)).toBe(true)
		})

		it('should fail if eth_blockNumber request fails', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0x1' as T)
					}
					if (method === 'eth_blockNumber') {
						return Effect.fail(new ForkError({ method, cause: new Error('RPC error') }))
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(forkConfigLayer)))

			expect(Exit.isFailure(result)).toBe(true)
		})
	})

	describe('malformed hex parsing errors', () => {
		it('should fail with ForkError when chainId is malformed', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('not_a_valid_hex' as T) // Malformed hex
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x1' as T)
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(forkConfigLayer)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const cause = result.cause
				// @ts-expect-error - accessing internal structure
				const error = cause._tag === 'Fail' ? cause.error : undefined
				expect(error).toBeDefined()
				expect(error._tag).toBe('ForkError')
				expect(error.method).toBe('eth_chainId')
				expect(error.message).toContain('Failed to parse chain ID')
			}
		})

		it('should fail with ForkError when blockNumber is malformed', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0x1' as T)
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('invalid_block_number' as T) // Malformed hex
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(forkConfigLayer)))

			expect(Exit.isFailure(result)).toBe(true)
			if (Exit.isFailure(result)) {
				const cause = result.cause
				// @ts-expect-error - accessing internal structure
				const error = cause._tag === 'Fail' ? cause.error : undefined
				expect(error).toBeDefined()
				expect(error._tag).toBe('ForkError')
				expect(error.method).toBe('eth_blockNumber')
				expect(error.message).toContain('Failed to parse block number')
			}
		})
	})

	describe('hex parsing', () => {
		it('should correctly parse Ethereum mainnet chainId', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0x1' as T) // Ethereum mainnet
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x1' as T)
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.chainId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(forkConfigLayer)))
			expect(result).toBe(1n)
		})

		it('should correctly parse Optimism chainId', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0xa' as T) // Optimism
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x1' as T)
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.chainId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(forkConfigLayer)))
			expect(result).toBe(10n)
		})

		it('should correctly parse large block numbers', async () => {
			const mockTransport: TransportShape = {
				request: <T>(method: string) => {
					if (method === 'eth_chainId') {
						return Effect.succeed('0x1' as T)
					}
					if (method === 'eth_blockNumber') {
						return Effect.succeed('0x6dac2c0' as T) // 115000000 in hex
					}
					return Effect.fail(new ForkError({ method, cause: new Error('Unknown method') }))
				},
			}

			const transportLayer = Layer.succeed(TransportService, mockTransport)
			const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.blockTag
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(forkConfigLayer)))
			expect(result).toBe(115000000n)
		})
	})
})
