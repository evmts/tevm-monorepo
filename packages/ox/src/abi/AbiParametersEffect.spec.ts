import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { AbiParametersEffectLayer, AbiParametersEffectTag } from './AbiParametersEffect.js'

describe('AbiParametersEffect', () => {
	it('should parse parameters in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiParametersEffectTag, (abiParams) => abiParams.parseEffect('address to, uint256 amount')),
				AbiParametersEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toHaveLength(2)
		expect(result[0]).toEqual({
			type: 'address',
			name: 'to',
		})
		expect(result[1]).toEqual({
			type: 'uint',
			size: 256,
			baseType: 'uint256',
			name: 'amount',
		})
	})

	it('should format parameters in an effect', async () => {
		const params = [
			{ type: 'address', name: 'to' },
			{ type: 'uint', size: 256, baseType: 'uint256', name: 'amount' },
		]

		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiParametersEffectTag, (abiParams) => abiParams.formatEffect(params)),
				AbiParametersEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('address to, uint256 amount')
	})

	it('should handle empty parameters in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiParametersEffectTag, (abiParams) => abiParams.parseEffect('')),
				AbiParametersEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toHaveLength(0)
	})

	it('should handle parameters without names in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiParametersEffectTag, (abiParams) => abiParams.parseEffect('address, uint256')),
				AbiParametersEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toHaveLength(2)
		expect(result[0]).toEqual({
			type: 'address',
		})
		expect(result[1]).toEqual({
			type: 'uint',
			size: 256,
			baseType: 'uint256',
		})
	})
})
