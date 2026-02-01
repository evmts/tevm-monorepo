import { describe, it, expect } from 'vitest'
import { Context, Effect, Layer } from 'effect'
import { TevmActionsService } from './TevmActionsService.js'

describe('TevmActionsService', () => {
	it('should be a valid Context.Tag', () => {
		expect(TevmActionsService).toBeDefined()
		expect(typeof TevmActionsService).toBe('object')
	})

	it('should be usable as Context.Tag', () => {
		// The service should be usable as a Context.Tag identifier
		expect(typeof TevmActionsService).toBe('object')
		// GenericTag creates objects that can be used with Layer.succeed and Effect.gen
		expect(TevmActionsService).toBeDefined()
	})

	it('should be usable in Effect.gen', async () => {
		const mockTevmActions = {
			call: () =>
				Effect.succeed({
					rawData: '0x' as const,
					executionGasUsed: 21000n,
				}),
			getAccount: () =>
				Effect.succeed({
					address: '0x1234567890123456789012345678901234567890' as const,
					nonce: 0n,
					balance: 1000000000000000000n,
					deployedBytecode: '0x' as const,
					storageRoot:
						'0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,
					codeHash:
						'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as const,
					isContract: false,
					isEmpty: false,
				}),
			setAccount: () =>
				Effect.succeed({
					address: '0x1234567890123456789012345678901234567890' as const,
				}),
			dumpState: () => Effect.succeed('0x' as const),
			loadState: () => Effect.succeed(undefined),
			mine: () => Effect.succeed(undefined),
		}

		const testLayer = Layer.succeed(TevmActionsService, mockTevmActions as any)

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			const account = yield* tevmActions.getAccount({
				address: '0x1234567890123456789012345678901234567890' as const,
			})
			return account
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
		expect(result.balance).toBe(1000000000000000000n)
	})
})
