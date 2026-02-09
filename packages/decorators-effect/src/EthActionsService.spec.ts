import { Effect, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { EthActionsService } from './EthActionsService.js'

describe('EthActionsService', () => {
	it('should be a valid Context.Tag', () => {
		expect(EthActionsService).toBeDefined()
		expect(typeof EthActionsService).toBe('object')
	})

	it('should be usable as Context.Tag', () => {
		// The service should be usable as a Context.Tag identifier
		expect(typeof EthActionsService).toBe('object')
		// GenericTag creates objects that can be used with Layer.succeed and Effect.gen
		expect(EthActionsService).toBeDefined()
	})

	it('should be usable in Effect.gen', async () => {
		const mockEthActions = {
			blockNumber: () => Effect.succeed(100n),
			call: () => Effect.succeed('0x' as const),
			chainId: () => Effect.succeed(1n),
			gasPrice: () => Effect.succeed(1000000000n),
			getBalance: () => Effect.succeed(1000000000000000000n),
			getCode: () => Effect.succeed('0x' as const),
			getStorageAt: () => Effect.succeed('0x0000000000000000000000000000000000000000000000000000000000000000' as const),
		}

		const testLayer = Layer.succeed(EthActionsService, mockEthActions as any)

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			const blockNumber = yield* ethActions.blockNumber()
			return blockNumber
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
		expect(result).toBe(100n)
	})
})
