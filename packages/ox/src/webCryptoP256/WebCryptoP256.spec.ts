import { Effect } from 'effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as WebCryptoP256 from './WebCryptoP256.js'

// Mock the WebCryptoP256 module from Ox
const mockGetPublicKey = vi.fn()
const mockImportPrivateKey = vi.fn()
const mockImportPublicKey = vi.fn()
const mockExportPublicKey = vi.fn()
const mockExportPrivateKey = vi.fn()
const mockGenerateKeyPair = vi.fn()
const mockSign = vi.fn()
const mockVerify = vi.fn()

vi.mock('ox', () => ({
	default: {
		WebCryptoP256: {
			getPublicKey: (...args: any[]) => mockGetPublicKey(...args),
			importPrivateKey: (...args: any[]) => mockImportPrivateKey(...args),
			importPublicKey: (...args: any[]) => mockImportPublicKey(...args),
			exportPublicKey: (...args: any[]) => mockExportPublicKey(...args),
			exportPrivateKey: (...args: any[]) => mockExportPrivateKey(...args),
			generateKeyPair: (...args: any[]) => mockGenerateKeyPair(...args),
			sign: (...args: any[]) => mockSign(...args),
			verify: (...args: any[]) => mockVerify(...args),
		},
		Hex: {
			// Minimal mock for Hex
		},
		Bytes: {
			// Minimal mock for Bytes
		},
		PublicKey: {
			// Minimal mock for PublicKey
		},
		Signature: {
			// Minimal mock for Signature
		},
	},
}))

describe('WebCryptoP256', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('getPublicKey', () => {
		it('should get the public key from a private key', async () => {
			const mockPrivateKey = '0x1234'
			const mockPublicKey = { x: '0xabcd', y: '0xefgh' }
			mockGetPublicKey.mockReturnValue(mockPublicKey)

			const program = WebCryptoP256.getPublicKey({ privateKey: mockPrivateKey })
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

			const program = WebCryptoP256.getPublicKey({ privateKey: mockPrivateKey })

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(WebCryptoP256.GetPublicKeyError)
				expect(err._tag).toBe('GetPublicKeyError')
				expect(err.message).toContain('Unexpected error getting WebCrypto P256 public key with ox')
			}
		})
	})

	describe('importPrivateKey', () => {
		it('should import a private key from JWK format', async () => {
			const mockJwk = { kty: 'EC', crv: 'P-256' }
			const mockCryptoKey = {} as CryptoKey
			mockImportPrivateKey.mockReturnValue(mockCryptoKey)

			const program = WebCryptoP256.importPrivateKey({ jwk: mockJwk })
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockCryptoKey)
			expect(mockImportPrivateKey).toHaveBeenCalledWith({ jwk: mockJwk })
		})

		it('should handle errors properly', async () => {
			const mockJwk = { kty: 'EC', crv: 'P-256' }
			const error = new Error('Invalid JWK format')
			mockImportPrivateKey.mockImplementation(() => {
				throw error
			})

			const program = WebCryptoP256.importPrivateKey({ jwk: mockJwk })

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(WebCryptoP256.ImportPrivateKeyError)
				expect(err._tag).toBe('ImportPrivateKeyError')
				expect(err.message).toContain('Unexpected error importing WebCrypto P256 private key with ox')
			}
		})
	})

	describe('importPublicKey', () => {
		it('should import a public key from JWK format', async () => {
			const mockJwk = { kty: 'EC', crv: 'P-256' }
			const mockCryptoKey = {} as CryptoKey
			mockImportPublicKey.mockReturnValue(mockCryptoKey)

			const program = WebCryptoP256.importPublicKey({ jwk: mockJwk })
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockCryptoKey)
			expect(mockImportPublicKey).toHaveBeenCalledWith({ jwk: mockJwk })
		})

		it('should handle errors properly', async () => {
			const mockJwk = { kty: 'EC', crv: 'P-256' }
			const error = new Error('Invalid JWK format')
			mockImportPublicKey.mockImplementation(() => {
				throw error
			})

			const program = WebCryptoP256.importPublicKey({ jwk: mockJwk })

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(WebCryptoP256.ImportPublicKeyError)
				expect(err._tag).toBe('ImportPublicKeyError')
				expect(err.message).toContain('Unexpected error importing WebCrypto P256 public key with ox')
			}
		})
	})

	describe('exportPublicKey', () => {
		it('should export a public key to JWK format', async () => {
			const mockPublicKey = {} as CryptoKey
			const mockJwk = { kty: 'EC', crv: 'P-256' }
			mockExportPublicKey.mockReturnValue(mockJwk)

			const program = WebCryptoP256.exportPublicKey({ publicKey: mockPublicKey })
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockJwk)
			expect(mockExportPublicKey).toHaveBeenCalledWith({ publicKey: mockPublicKey })
		})

		it('should handle errors properly', async () => {
			const mockPublicKey = {} as CryptoKey
			const error = new Error('Invalid public key')
			mockExportPublicKey.mockImplementation(() => {
				throw error
			})

			const program = WebCryptoP256.exportPublicKey({ publicKey: mockPublicKey })

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(WebCryptoP256.ExportPublicKeyError)
				expect(err._tag).toBe('ExportPublicKeyError')
				expect(err.message).toContain('Unexpected error exporting WebCrypto P256 public key with ox')
			}
		})
	})

	describe('exportPrivateKey', () => {
		it('should export a private key to JWK format', async () => {
			const mockPrivateKey = {} as CryptoKey
			const mockJwk = { kty: 'EC', crv: 'P-256', d: 'private-key-data' }
			mockExportPrivateKey.mockReturnValue(mockJwk)

			const program = WebCryptoP256.exportPrivateKey({ privateKey: mockPrivateKey })
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockJwk)
			expect(mockExportPrivateKey).toHaveBeenCalledWith({ privateKey: mockPrivateKey })
		})

		it('should handle errors properly', async () => {
			const mockPrivateKey = {} as CryptoKey
			const error = new Error('Invalid private key')
			mockExportPrivateKey.mockImplementation(() => {
				throw error
			})

			const program = WebCryptoP256.exportPrivateKey({ privateKey: mockPrivateKey })

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(WebCryptoP256.ExportPrivateKeyError)
				expect(err._tag).toBe('ExportPrivateKeyError')
				expect(err.message).toContain('Unexpected error exporting WebCrypto P256 private key with ox')
			}
		})
	})

	describe('generateKeyPair', () => {
		it('should generate a new key pair', async () => {
			const mockKeyPair = {
				privateKey: {} as CryptoKey,
				publicKey: {} as CryptoKey,
			}
			mockGenerateKeyPair.mockReturnValue(mockKeyPair)

			const program = WebCryptoP256.generateKeyPair()
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockKeyPair)
			expect(mockGenerateKeyPair).toHaveBeenCalled()
		})

		it('should handle errors properly', async () => {
			const error = new Error('Failed to generate key pair')
			mockGenerateKeyPair.mockImplementation(() => {
				throw error
			})

			const program = WebCryptoP256.generateKeyPair()

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(WebCryptoP256.GenerateKeyPairError)
				expect(err._tag).toBe('GenerateKeyPairError')
				expect(err.message).toContain('Unexpected error generating WebCrypto P256 key pair with ox')
			}
		})
	})

	describe('sign', () => {
		it('should sign a payload with a private key', async () => {
			const mockOptions = {
				payload: '0x1234',
				privateKey: {} as CryptoKey,
				hash: true,
			}
			const mockSignature = '0xabcdef'
			mockSign.mockReturnValue(mockSignature)

			const program = WebCryptoP256.sign(mockOptions)
			const result = await Effect.runPromise(program)

			expect(result).toBe(mockSignature)
			expect(mockSign).toHaveBeenCalledWith(mockOptions)
		})

		it('should handle errors properly', async () => {
			const mockOptions = {
				payload: '0x1234',
				privateKey: {} as CryptoKey,
				hash: true,
			}
			const error = new Error('Signing failed')
			mockSign.mockImplementation(() => {
				throw error
			})

			const program = WebCryptoP256.sign(mockOptions)

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(WebCryptoP256.SignError)
				expect(err._tag).toBe('SignError')
				expect(err.message).toContain('Unexpected error signing with WebCrypto P256 with ox')
			}
		})
	})

	describe('verify', () => {
		it('should verify a signature', async () => {
			const mockOptions = {
				payload: '0x1234',
				publicKey: {} as CryptoKey,
				signature: '0xabcdef',
				hash: true,
			}
			mockVerify.mockReturnValue(true)

			const program = WebCryptoP256.verify(mockOptions)
			const result = await Effect.runPromise(program)

			expect(result).toBe(true)
			expect(mockVerify).toHaveBeenCalledWith(mockOptions)
		})

		it('should handle errors properly', async () => {
			const mockOptions = {
				payload: '0x1234',
				publicKey: {} as CryptoKey,
				signature: '0xabcdef',
				hash: true,
			}
			const error = new Error('Verification failed')
			mockVerify.mockImplementation(() => {
				throw error
			})

			const program = WebCryptoP256.verify(mockOptions)

			try {
				await Effect.runPromise(program)
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeInstanceOf(WebCryptoP256.VerifyError)
				expect(err._tag).toBe('VerifyError')
				expect(err.message).toContain('Unexpected error verifying with WebCrypto P256 with ox')
			}
		})
	})
})
