import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { AbiFunctionEffectLayer, AbiFunctionEffectTag } from './AbiFunctionEffect.js'

describe('AbiFunctionEffect', () => {
	it('should parse a human-readable ABI function', async () => {
		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				abiFunction.fromEffect('function transfer(address to, uint256 value) returns (bool)'),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result).toEqual({
			type: 'function',
			name: 'transfer',
			inputs: [
				{ name: 'to', type: 'address' },
				{ name: 'value', type: 'uint256' },
			],
			outputs: [{ type: 'bool' }],
			stateMutability: 'nonpayable',
		})
	})

	it('should format an ABI function', async () => {
		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				pipe(
					abiFunction.fromEffect('function transfer(address to, uint256 value) returns (bool)'),
					Effect.flatMap((func) => abiFunction.formatEffect(func)),
				),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('function transfer(address to, uint256 value) returns (bool)')
	})

	it('should get function selector', async () => {
		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				abiFunction.getSelectorEffect('function transfer(address to, uint256 value) returns (bool)'),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('0xa9059cbb')
	})

	it('should encode function data with arguments', async () => {
		const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
		const testValue = 1000000000000000000n

		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				pipe(
					abiFunction.fromEffect('function transfer(address to, uint256 value) returns (bool)'),
					Effect.flatMap((func) => abiFunction.encodeDataEffect(func, [testAddress, testValue])),
				),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result.startsWith('0xa9059cbb')).toBe(true) // Transfer function selector
		expect(result.length > 8).toBe(true) // Should have data beyond selector
	})

	it('should encode function data without arguments', async () => {
		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				pipe(
					abiFunction.fromEffect('function totalSupply() returns (uint256)'),
					Effect.flatMap((func) => abiFunction.encodeDataEffect(func)),
				),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('0x18160ddd') // totalSupply function selector
	})

	it('should encode function result', async () => {
		const testValue = 1000000000000000000n

		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				pipe(
					abiFunction.fromEffect('function totalSupply() returns (uint256)'),
					Effect.flatMap((func) => abiFunction.encodeResultEffect(func, testValue)),
				),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result.length).toBe(66) // 32 bytes of data + 0x prefix
	})

	it('should decode function data', async () => {
		const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
		const testValue = 1000000000000000000n

		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				pipe(
					abiFunction.fromEffect('function transfer(address to, uint256 value) returns (bool)'),
					Effect.flatMap((func) =>
						Effect.flatMap(abiFunction.encodeDataEffect(func, [testAddress, testValue]), (data) =>
							abiFunction.decodeDataEffect(func, data),
						),
					),
				),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = (await Effect.runPromise(program)) as [string, bigint]
		expect(result[0].toLowerCase()).toBe(testAddress.toLowerCase())
		expect(result[1]).toBe(testValue)
	})

	it('should decode function result', async () => {
		const testValue = 1000000000000000000n

		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				pipe(
					abiFunction.fromEffect('function totalSupply() returns (uint256)'),
					Effect.flatMap((func) =>
						Effect.flatMap(abiFunction.encodeResultEffect(func, testValue), (data) =>
							abiFunction.decodeResultEffect(func, data),
						),
					),
				),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe(testValue)
	})

	it('should extract a function from an ABI', async () => {
		const program = pipe(
			Effect.flatMap(AbiFunctionEffectTag, (abiFunction) =>
				abiFunction.fromAbiEffect(
					[
						'function transfer(address to, uint256 value) returns (bool)',
						'function balanceOf(address owner) view returns (uint256)',
					],
					'balanceOf',
				),
			),
			Effect.provide(AbiFunctionEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result.name).toBe('balanceOf')
		expect(result.type).toBe('function')
		expect(result.stateMutability).toBe('view')
	})
})
