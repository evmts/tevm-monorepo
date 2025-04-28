import { Effect } from 'effect'
import { Hex } from 'ox'
import { describe, expect, it } from 'vitest'
import {
	PersonalMessageEffectLayer,
	PersonalMessageEffectLive,
	PersonalMessageEffectTag,
} from './PersonalMessageEffect.js'

describe('PersonalMessageEffect', () => {
	const testMessage = Hex.fromString('hello world')
	const expectedEncoded = '0x19457468657265756d205369676e6564204d6573736167653a0a313168656c6c6f20776f726c64'

	describe('encodeEffect', () => {
		it('should encode a personal message', async () => {
			const program = Effect.provideService(
				PersonalMessageEffectTag,
				PersonalMessageEffectLive,
			)(
				Effect.flatMap(PersonalMessageEffectTag, (personalMessageEffect) =>
					personalMessageEffect.encodeEffect(testMessage),
				),
			)

			const result = await Effect.runPromise(program)
			expect(result).toBe(expectedEncoded)
		})
	})

	describe('getSignPayloadEffect', () => {
		it('should get the sign payload for a personal message', async () => {
			const program = Effect.provideService(
				PersonalMessageEffectTag,
				PersonalMessageEffectLive,
			)(
				Effect.flatMap(PersonalMessageEffectTag, (personalMessageEffect) =>
					personalMessageEffect.getSignPayloadEffect(testMessage),
				),
			)

			const result = await Effect.runPromise(program)
			// The result should be the keccak256 hash of the encoded message
			expect(result).toBe('0xb453bd4e271eed985cbab8231da609c4ce0a9cf1f763b6c1594e76315510e0f1')
		})
	})

	describe('Layer', () => {
		it('should provide the PersonalMessageEffectService via Layer', async () => {
			const program = Effect.provideLayer(PersonalMessageEffectLayer)(
				Effect.flatMap(PersonalMessageEffectTag, (personalMessageEffect) =>
					personalMessageEffect.encodeEffect(testMessage),
				),
			)

			const result = await Effect.runPromise(program)
			expect(result).toBe(expectedEncoded)
		})
	})
})
