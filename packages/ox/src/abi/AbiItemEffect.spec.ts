import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { AbiItemEffectLayer, AbiItemEffectTag } from './AbiItemEffect.js'

describe('AbiItemEffect', () => {
	it('should parse component in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiItemEffectTag, (abiItem) => abiItem.parseComponentEffect('uint256')),
				AbiItemEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toEqual({
			type: 'uint',
			size: 256,
			baseType: 'uint256',
		})
	})

	it('should parse param in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiItemEffectTag, (abiItem) => abiItem.parseParamEffect('uint256 amount')),
				AbiItemEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toEqual({
			type: 'uint',
			size: 256,
			baseType: 'uint256',
			name: 'amount',
		})
	})

	it('should format component in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiItemEffectTag, (abiItem) =>
					abiItem.formatComponentEffect({
						type: 'uint',
						size: 256,
						baseType: 'uint256',
					}),
				),
				AbiItemEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('uint256')
	})

	it('should format param in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiItemEffectTag, (abiItem) =>
					abiItem.formatParamEffect({
						type: 'uint',
						size: 256,
						baseType: 'uint256',
						name: 'amount',
					}),
				),
				AbiItemEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('uint256 amount')
	})

	it('should return parseAbiItem function in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiItemEffectTag, (abiItem) => abiItem.parseAbiItemEffect('function')),
				AbiItemEffectLayer,
			),
		)

		const parseFunction = await Effect.runPromise(program)
		expect(typeof parseFunction).toBe('function')

		const parsed = parseFunction('transfer(address to, uint256 amount)')
		expect(parsed).toHaveProperty('name', 'transfer')
		expect(parsed).toHaveProperty('type', 'function')
		expect(parsed.inputs).toHaveLength(2)
		expect(parsed.inputs[0]).toHaveProperty('name', 'to')
		expect(parsed.inputs[1]).toHaveProperty('name', 'amount')
	})
})
