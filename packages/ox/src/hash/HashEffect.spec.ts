import { Effect } from 'effect'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { HashEffectLive } from './HashEffect.js'

describe('HashEffect', () => {
	describe('keccak256Effect', () => {
		it('should calculate the Keccak256 hash of a hex string', async () => {
			const program = HashEffectLive.keccak256Effect('0xdeadbeef')
			const result = await Effect.runPromise(program)
			expect(result).toBe('0xd4fd4e189132273036449fc9e11199c739161b4c0116a9a2dccdfa1c492006f1')
		})

		it('should return bytes when specified', async () => {
			const program = HashEffectLive.keccak256Effect('0xdeadbeef', { as: 'Bytes' })
			const result = await Effect.runPromise(program)
			expect(result).toBeInstanceOf(Uint8Array)
		})

		it('should handle invalid inputs', async () => {
			const program = HashEffectLive.keccak256Effect('not-a-hex' as any)
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})

	describe('ripemd160Effect', () => {
		it('should calculate the Ripemd160 hash of a hex string', async () => {
			const program = HashEffectLive.ripemd160Effect('0xdeadbeef')
			const result = await Effect.runPromise(program)
			expect(result).toBe('0x226821c2f5423e11fe9af68bd285c249db2e4b5a')
		})
	})

	describe('sha256Effect', () => {
		it('should calculate the Sha256 hash of a hex string', async () => {
			const program = HashEffectLive.sha256Effect('0xdeadbeef')
			const result = await Effect.runPromise(program)
			expect(result).toBe('0x5f78c33274e43fa9de5659265c1d917e25c03722dcb0b8d27db8d5feaa813953')
		})
	})

	describe('validateEffect', () => {
		it('should validate a correct hash', async () => {
			const validHash = '0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0'
			const program = HashEffectLive.validateEffect(validHash)
			const result = await Effect.runPromise(program)
			expect(result).toBe(true)
		})

		it('should invalidate an incorrect hash', async () => {
			const invalidHash = '0x'
			const program = HashEffectLive.validateEffect(invalidHash)
			const result = await Effect.runPromise(program)
			expect(result).toBe(false)
		})
	})
})
