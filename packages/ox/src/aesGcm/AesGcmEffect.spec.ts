import { Effect } from 'effect'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { AesGcmEffectLive } from './AesGcmEffect.js'

describe('AesGcmEffect', () => {
	describe('encryption/decryption workflow', () => {
		it('should encrypt and decrypt data correctly', async () => {
			const password = 'test-password'
			const secret = Hex.fromString('this is a secret message')

			// Get key
			const keyProgram = AesGcmEffectLive.getKeyEffect({ password })
			const key = await Effect.runPromise(keyProgram)
			expect(key).toBeInstanceOf(CryptoKey)

			// Encrypt
			const encryptProgram = AesGcmEffectLive.encryptEffect(secret, key)
			const encrypted = await Effect.runPromise(encryptProgram)
			expect(encrypted).toBeTypeOf('string')
			expect(encrypted.startsWith('0x')).toBe(true)

			// Decrypt
			const decryptProgram = AesGcmEffectLive.decryptEffect(encrypted, key)
			const decrypted = await Effect.runPromise(decryptProgram)
			expect(decrypted).toBe(secret)
		})
	})

	describe('randomSaltEffect', () => {
		it('should generate random salt of specified size', async () => {
			const size = 16
			const program = AesGcmEffectLive.randomSaltEffect(size)
			const salt = await Effect.runPromise(program)

			expect(salt).toBeInstanceOf(Uint8Array)
			expect(salt.length).toBe(size)
		})

		it('should generate random salt of default size (32) when no size specified', async () => {
			const program = AesGcmEffectLive.randomSaltEffect()
			const salt = await Effect.runPromise(program)

			expect(salt).toBeInstanceOf(Uint8Array)
			expect(salt.length).toBe(32)
		})
	})

	describe('getKeyEffect', () => {
		it('should derive a key from a password with custom options', async () => {
			const options = {
				password: 'test-password',
				iterations: 10000, // Using smaller number for test speed
				salt: new Uint8Array(32).fill(1), // Use fixed salt for deterministic test
			}

			const program = AesGcmEffectLive.getKeyEffect(options)
			const key = await Effect.runPromise(program)

			expect(key).toBeInstanceOf(CryptoKey)
		})
	})

	describe('error handling', () => {
		it('should handle errors in decryption', async () => {
			const invalidEncrypted = '0x1234' // Invalid encrypted data (too short)
			const password = 'test-password'

			const keyProgram = AesGcmEffectLive.getKeyEffect({ password })
			const key = await Effect.runPromise(keyProgram)

			const program = AesGcmEffectLive.decryptEffect(invalidEncrypted, key)
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})
})
