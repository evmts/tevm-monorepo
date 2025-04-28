import { Effect } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { RlpEffectLive } from './RlpEffect.js'

describe('RlpEffect', () => {
	// Example RLP encoded value for "hello world"
	const rlpHelloWorldHex = '0x8b68656c6c6f20776f726c64'
	const decodedHex = '0x68656c6c6f20776f726c64' // "hello world" in hex

	describe('toBytesEffect', () => {
		it('should decode RLP hex to bytes', async () => {
			const program = RlpEffectLive.toBytesEffect(rlpHelloWorldHex)
			const result = await Effect.runPromise(program)
			expect(result).toBeInstanceOf(Uint8Array)
			expect(Hex.fromBytes(result as Uint8Array)).toBe(decodedHex)
		})

		it('should handle invalid RLP values', async () => {
			const program = RlpEffectLive.toBytesEffect('0x')
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})

	describe('toHexEffect', () => {
		it('should decode RLP hex to hex', async () => {
			const program = RlpEffectLive.toHexEffect(rlpHelloWorldHex)
			const result = await Effect.runPromise(program)
			expect(result).toBe(decodedHex)
		})
	})

	describe('fromEffect', () => {
		it('should encode value to RLP with specified format', async () => {
			const program = RlpEffectLive.fromEffect(decodedHex, { as: 'Hex' })
			const result = await Effect.runPromise(program)
			expect(result).toBe(rlpHelloWorldHex)
		})
	})

	describe('fromBytesEffect', () => {
		it('should encode bytes to RLP', async () => {
			const bytes = Bytes.fromHex(decodedHex)
			const program = RlpEffectLive.fromBytesEffect(bytes, { as: 'Hex' })
			const result = await Effect.runPromise(program)
			expect(result).toBe(rlpHelloWorldHex)
		})
	})

	describe('fromHexEffect', () => {
		it('should encode hex to RLP', async () => {
			const program = RlpEffectLive.fromHexEffect(decodedHex)
			const result = await Effect.runPromise(program)
			expect(result).toBe(rlpHelloWorldHex)
		})
	})

	describe('complex structures', () => {
		it('should handle nested arrays', async () => {
			// Encoding a nested structure: ["hello", ["world"]]
			const nestedStructure = ['0x68656c6c6f', ['0x776f726c64']]
			const program = RlpEffectLive.fromHexEffect(nestedStructure as any)
			const result = await Effect.runPromise(program)

			// Decode the result to verify
			const decodeProgram = RlpEffectLive.toHexEffect(result)
			const decoded = await Effect.runPromise(decodeProgram)

			expect(Array.isArray(decoded)).toBe(true)
			expect(decoded[0]).toBe('0x68656c6c6f')
			expect(Array.isArray(decoded[1])).toBe(true)
			expect((decoded[1] as any)[0]).toBe('0x776f726c64')
		})
	})
})
