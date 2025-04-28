import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { BytesEffectLayer, BytesEffectTag } from './BytesEffect.js'

describe('BytesEffect', () => {
	it('should convert array to bytes using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(BytesEffectTag, (bytes) => bytes.fromArrayEffect([72, 101, 108, 108, 111])),
				BytesEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBeInstanceOf(Uint8Array)
		expect(result.length).toBe(5)
		expect(Array.from(result)).toEqual([72, 101, 108, 108, 111])
	})

	it('should convert string to bytes using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(BytesEffectTag, (bytes) => bytes.fromStringEffect('Hello')),
				BytesEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBeInstanceOf(Uint8Array)
		expect(Array.from(result)).toEqual([72, 101, 108, 108, 111])
	})

	it('should convert boolean to bytes using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(BytesEffectTag, (bytes) => bytes.fromBooleanEffect(true)),
				BytesEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBeInstanceOf(Uint8Array)
		expect(Array.from(result)).toEqual([1])
	})

	it('should concat bytes arrays using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(BytesEffectTag, (bytes) =>
					Effect.flatMap(bytes.fromArrayEffect([1, 2]), (arr1) =>
						Effect.flatMap(bytes.fromArrayEffect([3, 4]), (arr2) => bytes.concatEffect(arr1, arr2)),
					),
				),
				BytesEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBeInstanceOf(Uint8Array)
		expect(Array.from(result)).toEqual([1, 2, 3, 4])
	})
})
