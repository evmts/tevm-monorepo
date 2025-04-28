import { Effect } from 'effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as P256 from './P256.js'

// Mock the P256 module from Ox
const mockGetPublicKey = vi.fn()
const mockRandomPrivateKey = vi.fn()
const mockRecoverPublicKey = vi.fn()
const mockSign = vi.fn()
const mockVerify = vi.fn()

vi.mock('ox', () => ({
	default: {
		P256: {
			getPublicKey: (...args: any[]) => mockGetPublicKey(...args),
			randomPrivateKey: (...args: any[]) => mockRandomPrivateKey(...args),
			recoverPublicKey: (...args: any[]) => mockRecoverPublicKey(...args),
			sign: (...args: any[]) => mockSign(...args),
			verify: (...args: any[]) => mockVerify(...args),
		},
	},
}))

describe('P256', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('getPublicKey', () => {
		it('should get a public key from a private key', async () => {
			const mockPrivateKey = '0x1234'
			const mockPublicKey = { x: '0xabcd', y: '0xef12' }
			mockGetPublicKey.mockReturnValue(mockPublicKey)

			const program = P256.getPublicKey({ privateKey: mockPrivateKey })
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockPublicKey)
			expect(mockGetPublicKey).toHaveBeenCalledWith({ privateKey: mockPrivateKey })
		})

		it('should handle errors properly', async () => {
			const mockPrivateKey = '0x1234'
			const error = new Error('Invalid private key')
			mockGetPublicKey.mockImplementation(() => {
				throw error
			})

			const program = P256.getPublicKey({ privateKey: mockPrivateKey })

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(P256.GetPublicKeyError)
				expect(err._tag).toBe('GetPublicKeyError')
				expect(err.message).toContain('Unexpected error getting P256 public key with ox')
			}
		})
	})

	describe('randomPrivateKey', () => {
		it('should generate a random private key', async () => {
			const mockPrivateKey = '0x1234567890abcdef'
			mockRandomPrivateKey.mockReturnValue(mockPrivateKey)

			const program = P256.randomPrivateKey()
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockPrivateKey)
			expect(mockRandomPrivateKey).toHaveBeenCalled()
		})

		it('should handle options correctly', async () => {
			const mockPrivateKey = new Uint8Array([1, 2, 3, 4])
			mockRandomPrivateKey.mockReturnValue(mockPrivateKey)

			const program = P256.randomPrivateKey({ as: 'Bytes' })
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockPrivateKey)
			expect(mockRandomPrivateKey).toHaveBeenCalledWith({ as: 'Bytes' })
		})

		it('should handle errors properly', async () => {
			const error = new Error('Failed to generate key')
			mockRandomPrivateKey.mockImplementation(() => {
				throw error
			})

			const program = P256.randomPrivateKey()

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(P256.RandomPrivateKeyError)
				expect(err._tag).toBe('RandomPrivateKeyError')
				expect(err.message).toContain('Unexpected error generating random P256 private key with ox')
			}
		})
	})

	describe('recoverPublicKey', () => {
		it('should recover a public key from a signature', async () => {
			const mockPayload = '0x1234'
			const mockSignature = { r: '0xabcd', s: '0xef12', v: 1 }
			const mockPublicKey = { x: '0xabcd', y: '0xef12' }
			mockRecoverPublicKey.mockReturnValue(mockPublicKey)

			const program = P256.recoverPublicKey({ payload: mockPayload, signature: mockSignature })
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockPublicKey)
			expect(mockRecoverPublicKey).toHaveBeenCalledWith({ payload: mockPayload, signature: mockSignature })
		})

		it('should handle errors properly', async () => {
			const mockPayload = '0x1234'
			const mockSignature = { r: '0xabcd', s: '0xef12', v: 1 }
			const error = new Error('Invalid signature')
			mockRecoverPublicKey.mockImplementation(() => {
				throw error
			})

			const program = P256.recoverPublicKey({ payload: mockPayload, signature: mockSignature })

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(P256.RecoverPublicKeyError)
				expect(err._tag).toBe('RecoverPublicKeyError')
				expect(err.message).toContain('Unexpected error recovering P256 public key from signature with ox')
			}
		})
	})

	describe('sign', () => {
		it('should sign a payload with a private key', async () => {
			const mockPayload = '0x1234'
			const mockPrivateKey = '0x5678'
			const mockSignature = { r: '0xabcd', s: '0xef12', v: 1 }
			mockSign.mockReturnValue(mockSignature)

			const program = P256.sign({ payload: mockPayload, privateKey: mockPrivateKey })
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockSignature)
			expect(mockSign).toHaveBeenCalledWith({ payload: mockPayload, privateKey: mockPrivateKey })
		})

		it('should handle optional parameters', async () => {
			const mockPayload = '0x1234'
			const mockPrivateKey = '0x5678'
			const mockExtraEntropy = '0x9abc'
			const mockSignature = { r: '0xabcd', s: '0xef12', v: 1 }
			mockSign.mockReturnValue(mockSignature)

			const program = P256.sign({
				payload: mockPayload,
				privateKey: mockPrivateKey,
				extraEntropy: mockExtraEntropy,
				hash: true,
			})
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockSignature)
			expect(mockSign).toHaveBeenCalledWith({
				payload: mockPayload,
				privateKey: mockPrivateKey,
				extraEntropy: mockExtraEntropy,
				hash: true,
			})
		})

		it('should handle errors properly', async () => {
			const mockPayload = '0x1234'
			const mockPrivateKey = '0x5678'
			const error = new Error('Invalid private key')
			mockSign.mockImplementation(() => {
				throw error
			})

			const program = P256.sign({ payload: mockPayload, privateKey: mockPrivateKey })

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(P256.SignError)
				expect(err._tag).toBe('SignError')
				expect(err.message).toContain('Unexpected error signing with P256 with ox')
			}
		})
	})

	describe('verify', () => {
		it('should verify a signature', async () => {
			const mockPayload = '0x1234'
			const mockPublicKey = { x: '0xabcd', y: '0xef12' }
			const mockSignature = { r: '0xabcd', s: '0xef12', v: 1 }
			mockVerify.mockReturnValue(true)

			const program = P256.verify({
				payload: mockPayload,
				publicKey: mockPublicKey,
				signature: mockSignature,
			})
			const result = await Effect.runPromise(program)

			expect(result).toBe(true)
			expect(mockVerify).toHaveBeenCalledWith({
				payload: mockPayload,
				publicKey: mockPublicKey,
				signature: mockSignature,
			})
		})

		it('should handle hash option', async () => {
			const mockPayload = '0x1234'
			const mockPublicKey = { x: '0xabcd', y: '0xef12' }
			const mockSignature = { r: '0xabcd', s: '0xef12', v: 1 }
			mockVerify.mockReturnValue(false)

			const program = P256.verify({
				payload: mockPayload,
				publicKey: mockPublicKey,
				signature: mockSignature,
				hash: true,
			})
			const result = await Effect.runPromise(program)

			expect(result).toBe(false)
			expect(mockVerify).toHaveBeenCalledWith({
				payload: mockPayload,
				publicKey: mockPublicKey,
				signature: mockSignature,
				hash: true,
			})
		})

		it('should handle errors properly', async () => {
			const mockPayload = '0x1234'
			const mockPublicKey = { x: '0xabcd', y: '0xef12' }
			const mockSignature = { r: '0xabcd', s: '0xef12', v: 1 }
			const error = new Error('Invalid signature format')
			mockVerify.mockImplementation(() => {
				throw error
			})

			const program = P256.verify({
				payload: mockPayload,
				publicKey: mockPublicKey,
				signature: mockSignature,
			})

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(P256.VerifyError)
				expect(err._tag).toBe('VerifyError')
				expect(err.message).toContain('Unexpected error verifying P256 signature with ox')
			}
		})
	})
})
