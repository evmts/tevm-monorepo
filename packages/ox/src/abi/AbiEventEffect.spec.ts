import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { AbiEventEffectLayer, AbiEventEffectTag } from './AbiEventEffect.js'

describe('AbiEventEffect', () => {
	it('should parse a human-readable ABI event', async () => {
		const program = pipe(
			Effect.flatMap(AbiEventEffectTag, (abiEvent) =>
				abiEvent.fromEffect('event Transfer(address indexed from, address indexed to, uint256 value)'),
			),
			Effect.provide(AbiEventEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result).toEqual({
			type: 'event',
			name: 'Transfer',
			inputs: [
				{ name: 'from', type: 'address', indexed: true },
				{ name: 'to', type: 'address', indexed: true },
				{ name: 'value', type: 'uint256' },
			],
		})
	})

	it('should format an ABI event', async () => {
		const program = pipe(
			Effect.flatMap(AbiEventEffectTag, (abiEvent) =>
				pipe(
					abiEvent.fromEffect('event Transfer(address indexed from, address indexed to, uint256 value)'),
					Effect.flatMap((event) => abiEvent.formatEffect(event)),
				),
			),
			Effect.provide(AbiEventEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('event Transfer(address indexed from, address indexed to, uint256 value)')
	})

	it('should get event selector', async () => {
		const program = pipe(
			Effect.flatMap(AbiEventEffectTag, (abiEvent) =>
				abiEvent.getSelectorEffect('event Transfer(address indexed from, address indexed to, uint256 value)'),
			),
			Effect.provide(AbiEventEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
	})

	it('should encode an event without args', async () => {
		const program = pipe(
			Effect.flatMap(AbiEventEffectTag, (abiEvent) =>
				pipe(
					abiEvent.fromEffect('event Transfer(address indexed from, address indexed to, uint256 value)'),
					Effect.flatMap((event) => abiEvent.encodeEffect(event)),
				),
			),
			Effect.provide(AbiEventEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result.topics[0]).toBe('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
		expect(result.topics.length).toBe(1)
	})

	it('should encode an event with args', async () => {
		const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

		const program = pipe(
			Effect.flatMap(AbiEventEffectTag, (abiEvent) =>
				pipe(
					abiEvent.fromEffect('event Transfer(address indexed from, address indexed to, uint256 value)'),
					Effect.flatMap((event) =>
						abiEvent.encodeEffect(event, {
							from: testAddress,
							to: testAddress,
						}),
					),
				),
			),
			Effect.provide(AbiEventEffectLayer),
		)

		const result = await Effect.runPromise(program)
		expect(result.topics[0]).toBe('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
		expect(result.topics.length).toBe(3)
		expect(result.topics[1].toLowerCase()).toContain(testAddress.substring(2).toLowerCase())
		expect(result.topics[2].toLowerCase()).toContain(testAddress.substring(2).toLowerCase())
	})

	it('should decode event log data', async () => {
		const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
		const testValue = '0x0000000000000000000000000000000000000000000000000000000000000001'

		const program = pipe(
			Effect.flatMap(AbiEventEffectTag, (abiEvent) =>
				pipe(
					abiEvent.fromEffect('event Transfer(address indexed from, address indexed to, uint256 value)'),
					Effect.flatMap((event) =>
						abiEvent.decodeEffect(event, {
							data: testValue,
							topics: [
								'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
								`0x000000000000000000000000${testAddress.substring(2)}`,
								`0x000000000000000000000000${testAddress.substring(2)}`,
							],
						}),
					),
				),
			),
			Effect.provide(AbiEventEffectLayer),
		)

		const result = (await Effect.runPromise(program)) as Record<string, unknown>
		expect(result.from.toString().toLowerCase()).toBe(testAddress.toLowerCase())
		expect(result.to.toString().toLowerCase()).toBe(testAddress.toLowerCase())
		expect(result.value).toBe(1n)
	})
})
