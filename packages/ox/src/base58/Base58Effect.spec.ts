import { Effect } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { Base58EffectLive } from './Base58Effect.js'

describe('Base58Effect', () => {
	const testString = 'Hello World!'
	const testBase58 = '2NEpo7TZRRrLZSi2U'

	describe('fromBytesEffect', () => {
		it('should encode Bytes to a Base58 string', async () => {
			const bytes = Bytes.fromString(testString)
			const program = Base58EffectLive.fromBytesEffect(bytes)
			const result = await Effect.runPromise(program)
			expect(result).toBe(testBase58)
		})
	})

	describe('fromHexEffect', () => {
		it('should encode Hex to a Base58 string', async () => {
			const hex = Hex.fromString(testString)
			const program = Base58EffectLive.fromHexEffect(hex)
			const result = await Effect.runPromise(program)
			expect(result).toBe(testBase58)
		})
	})

	describe('fromStringEffect', () => {
		it('should encode a string to a Base58 string', async () => {
			const program = Base58EffectLive.fromStringEffect(testString)
			const result = await Effect.runPromise(program)
			expect(result).toBe(testBase58)
		})
	})

	describe('toBytesEffect', () => {
		it('should decode a Base58 string to Bytes', async () => {
			const program = Base58EffectLive.toBytesEffect(testBase58)
			const result = await Effect.runPromise(program)
			expect(result).toBeInstanceOf(Uint8Array)
			expect(Bytes.toString(result)).toBe(testString)
		})

		it('should handle invalid Base58 strings', async () => {
			const program = Base58EffectLive.toBytesEffect('invalid*char')
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})

	describe('toHexEffect', () => {
		it('should decode a Base58 string to Hex', async () => {
			const program = Base58EffectLive.toHexEffect(testBase58)
			const result = await Effect.runPromise(program)
			expect(result).toBe(Hex.fromString(testString))
		})
	})

	describe('toStringEffect', () => {
		it('should decode a Base58 string to a string', async () => {
			const program = Base58EffectLive.toStringEffect(testBase58)
			const result = await Effect.runPromise(program)
			expect(result).toBe(testString)
		})
	})
})
