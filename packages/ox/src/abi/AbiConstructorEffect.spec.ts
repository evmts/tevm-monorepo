import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { AbiConstructorEffectLayer, AbiConstructorEffectTag } from './AbiConstructorEffect.js'

describe('AbiConstructorEffect', () => {
	const sampleConstructor = {
		type: 'constructor',
		inputs: [
			{ name: 'owner', type: 'address' },
			{ name: 'initialSupply', type: 'uint256' },
		],
		stateMutability: 'nonpayable',
	}

	const sampleAbi = [
		sampleConstructor,
		{
			type: 'function',
			name: 'transfer',
			inputs: [
				{ name: 'to', type: 'address' },
				{ name: 'value', type: 'uint256' },
			],
			outputs: [{ name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
		},
	]

	it('should parse AbiConstructor using fromEffect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiConstructorEffectTag, (abiConstructor) => abiConstructor.fromEffect(sampleConstructor)),
				AbiConstructorEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toStrictEqual(sampleConstructor)
	})

	it('should extract constructor from ABI using fromAbiEffect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiConstructorEffectTag, (abiConstructor) => abiConstructor.fromAbiEffect(sampleAbi)),
				AbiConstructorEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toStrictEqual(sampleConstructor)
	})

	it('should format constructor ABI using formatEffect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiConstructorEffectTag, (abiConstructor) => abiConstructor.formatEffect(sampleConstructor)),
				AbiConstructorEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(typeof result).toBe('string')
		expect(result).toContain('constructor')
		expect(result).toContain('address owner')
		expect(result).toContain('uint256 initialSupply')
	})

	// Note: More comprehensive tests for encode/decode would require actual bytecode
	// This is a simplified test to ensure the API structure is correct
	it('should handle errors properly', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AbiConstructorEffectTag, (abiConstructor) =>
					// @ts-expect-error Testing invalid input
					abiConstructor.fromEffect(null),
				),
				AbiConstructorEffectLayer,
			),
		)

		await expect(Effect.runPromise(program)).rejects.toThrow()
	})
})
