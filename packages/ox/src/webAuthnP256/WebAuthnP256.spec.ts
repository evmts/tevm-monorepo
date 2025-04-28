import { Effect } from 'effect'
import Ox from 'ox'
import { describe, expect, it, vi } from 'vitest'
import * as WebAuthnP256 from './WebAuthnP256.js'

vi.mock('ox', () => {
	return {
		default: {
			WebAuthnP256: {
				generateKeyPair: vi.fn(),
				sign: vi.fn(),
				verify: vi.fn(),
				getPublicKey: vi.fn(),
			},
		},
	}
})

describe('WebAuthnP256', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('generateKeyPair', () => {
		it('should generate a key pair successfully', async () => {
			const mockKeyPair = {
				privateKey: new Uint8Array([1, 2, 3]),
				publicKey: new Uint8Array([4, 5, 6]),
			}

			vi.mocked(Ox.WebAuthnP256.generateKeyPair).mockReturnValue(mockKeyPair)

			const result = await Effect.runPromise(WebAuthnP256.generateKeyPair())

			expect(Ox.WebAuthnP256.generateKeyPair).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockKeyPair)
		})

		it('should handle errors', async () => {
			const error = new Error('Failed to generate key pair')
			vi.mocked(Ox.WebAuthnP256.generateKeyPair).mockImplementation(() => {
				throw error
			})

			const effect = WebAuthnP256.generateKeyPair()

			await expect(Effect.runPromise(effect)).rejects.toThrow(WebAuthnP256.GenerateKeyPairError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GenerateKeyPairError',
				_tag: 'GenerateKeyPairError',
				cause: error,
			})
		})
	})

	describe('sign', () => {
		it('should sign a message successfully', async () => {
			const message = new Uint8Array([1, 2, 3, 4, 5])
			const privateKey = new Uint8Array([10, 11, 12])
			const expectedSignature = new Uint8Array([20, 21, 22, 23])

			vi.mocked(Ox.WebAuthnP256.sign).mockReturnValue(expectedSignature)

			const result = await Effect.runPromise(WebAuthnP256.sign(message, privateKey))

			expect(Ox.WebAuthnP256.sign).toHaveBeenCalledTimes(1)
			expect(Ox.WebAuthnP256.sign).toHaveBeenCalledWith(message, privateKey)
			expect(result).toEqual(expectedSignature)
		})

		it('should handle errors', async () => {
			const message = new Uint8Array([1, 2, 3, 4, 5])
			const privateKey = new Uint8Array([10, 11, 12])
			const error = new Error('Failed to sign message')

			vi.mocked(Ox.WebAuthnP256.sign).mockImplementation(() => {
				throw error
			})

			const effect = WebAuthnP256.sign(message, privateKey)

			await expect(Effect.runPromise(effect)).rejects.toThrow(WebAuthnP256.SignError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'SignError',
				_tag: 'SignError',
				cause: error,
			})
		})
	})

	describe('verify', () => {
		it('should verify a signature successfully', async () => {
			const message = new Uint8Array([1, 2, 3, 4, 5])
			const signature = new Uint8Array([20, 21, 22, 23])
			const publicKey = new Uint8Array([30, 31, 32])

			vi.mocked(Ox.WebAuthnP256.verify).mockReturnValue(true)

			const result = await Effect.runPromise(WebAuthnP256.verify(message, signature, publicKey))

			expect(Ox.WebAuthnP256.verify).toHaveBeenCalledTimes(1)
			expect(Ox.WebAuthnP256.verify).toHaveBeenCalledWith(message, signature, publicKey)
			expect(result).toBe(true)
		})

		it('should return false for invalid signatures', async () => {
			const message = new Uint8Array([1, 2, 3, 4, 5])
			const signature = new Uint8Array([20, 21, 22, 23])
			const publicKey = new Uint8Array([30, 31, 32])

			vi.mocked(Ox.WebAuthnP256.verify).mockReturnValue(false)

			const result = await Effect.runPromise(WebAuthnP256.verify(message, signature, publicKey))

			expect(result).toBe(false)
		})

		it('should handle errors', async () => {
			const message = new Uint8Array([1, 2, 3, 4, 5])
			const signature = new Uint8Array([20, 21, 22, 23])
			const publicKey = new Uint8Array([30, 31, 32])
			const error = new Error('Failed to verify signature')

			vi.mocked(Ox.WebAuthnP256.verify).mockImplementation(() => {
				throw error
			})

			const effect = WebAuthnP256.verify(message, signature, publicKey)

			await expect(Effect.runPromise(effect)).rejects.toThrow(WebAuthnP256.VerifyError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'VerifyError',
				_tag: 'VerifyError',
				cause: error,
			})
		})
	})

	describe('getPublicKey', () => {
		it('should get public key successfully', async () => {
			const privateKey = new Uint8Array([10, 11, 12])
			const expectedPublicKey = new Uint8Array([30, 31, 32])

			vi.mocked(Ox.WebAuthnP256.getPublicKey).mockReturnValue(expectedPublicKey)

			const result = await Effect.runPromise(WebAuthnP256.getPublicKey(privateKey))

			expect(Ox.WebAuthnP256.getPublicKey).toHaveBeenCalledTimes(1)
			expect(Ox.WebAuthnP256.getPublicKey).toHaveBeenCalledWith(privateKey)
			expect(result).toEqual(expectedPublicKey)
		})

		it('should handle errors', async () => {
			const privateKey = new Uint8Array([10, 11, 12])
			const error = new Error('Failed to get public key')

			vi.mocked(Ox.WebAuthnP256.getPublicKey).mockImplementation(() => {
				throw error
			})

			const effect = WebAuthnP256.getPublicKey(privateKey)

			await expect(Effect.runPromise(effect)).rejects.toThrow(WebAuthnP256.GetPublicKeyError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetPublicKeyError',
				_tag: 'GetPublicKeyError',
				cause: error,
			})
		})
	})
})
