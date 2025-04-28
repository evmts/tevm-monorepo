import { Effect } from 'effect'
import { Bytes } from 'ox/core/Bytes'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HdKeyEffectLive, HdKeyEffectService } from './HdKeyEffect.js'

// Mock the HdKey module
const mockFromSeed = vi.fn()
const mockFromExtendedKey = vi.fn()
const mockDerive = vi.fn()
const mockGetExtendedPrivateKey = vi.fn()
const mockGetExtendedPublicKey = vi.fn()
const mockGetAddress = vi.fn()

vi.mock('ox/crypto/hd-key', () => ({
	fromSeed: (...args: any[]) => mockFromSeed(...args),
	fromExtendedKey: (...args: any[]) => mockFromExtendedKey(...args),
	derive: (...args: any[]) => mockDerive(...args),
	getExtendedPrivateKey: (...args: any[]) => mockGetExtendedPrivateKey(...args),
	getExtendedPublicKey: (...args: any[]) => mockGetExtendedPublicKey(...args),
	getAddress: (...args: any[]) => mockGetAddress(...args),
}))

describe('HdKeyEffect', () => {
	const hdKey: HdKeyEffectService = HdKeyEffectLive

	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('fromSeedEffect', () => {
		it('should create an HD key from seed data', async () => {
			const mockSeed = Bytes.fromHex('0x1234')
			const mockHdKeyResult = { privateKey: Bytes.fromHex('0xabcd'), chainCode: Bytes.fromHex('0xefef') }

			mockFromSeed.mockReturnValue(mockHdKeyResult)

			const result = await Effect.runPromise(hdKey.fromSeedEffect(mockSeed))

			expect(result).toBe(mockHdKeyResult)
			expect(mockFromSeed).toHaveBeenCalledWith(mockSeed)
		})

		it('should handle errors properly', async () => {
			const mockSeed = Bytes.fromHex('0x1234')
			const error = new Error('Invalid seed')

			mockFromSeed.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(hdKey.fromSeedEffect(mockSeed))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})

	describe('fromExtendedKeyEffect', () => {
		it('should create an HD key from an extended key', async () => {
			const mockExtendedKey = 'xprv9s21ZrQH143K...'
			const mockHdKeyResult = { privateKey: Bytes.fromHex('0xabcd'), chainCode: Bytes.fromHex('0xefef') }

			mockFromExtendedKey.mockReturnValue(mockHdKeyResult)

			const result = await Effect.runPromise(hdKey.fromExtendedKeyEffect(mockExtendedKey))

			expect(result).toBe(mockHdKeyResult)
			expect(mockFromExtendedKey).toHaveBeenCalledWith(mockExtendedKey)
		})

		it('should handle errors properly', async () => {
			const mockExtendedKey = 'invalid-extended-key'
			const error = new Error('Invalid extended key')

			mockFromExtendedKey.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(hdKey.fromExtendedKeyEffect(mockExtendedKey))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})

	describe('deriveEffect', () => {
		it('should derive a child HD key from a path', async () => {
			const mockHdKey = { privateKey: Bytes.fromHex('0xabcd'), chainCode: Bytes.fromHex('0xefef') }
			const mockPath = "m/44'/60'/0'/0/0"
			const mockDerivedKey = { privateKey: Bytes.fromHex('0x5678'), chainCode: Bytes.fromHex('0x9abc') }

			mockDerive.mockReturnValue(mockDerivedKey)

			const result = await Effect.runPromise(hdKey.deriveEffect(mockHdKey, mockPath))

			expect(result).toBe(mockDerivedKey)
			expect(mockDerive).toHaveBeenCalledWith(mockHdKey, mockPath)
		})

		it('should handle errors properly', async () => {
			const mockHdKey = { privateKey: Bytes.fromHex('0xabcd'), chainCode: Bytes.fromHex('0xefef') }
			const mockPath = 'invalid-path'
			const error = new Error('Invalid derivation path')

			mockDerive.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(hdKey.deriveEffect(mockHdKey, mockPath))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})

	describe('getExtendedPrivateKeyEffect', () => {
		it('should get the extended private key', async () => {
			const mockHdKey = { privateKey: Bytes.fromHex('0xabcd'), chainCode: Bytes.fromHex('0xefef') }
			const mockExtendedPrivateKey = 'xprv9s21ZrQH143K...'

			mockGetExtendedPrivateKey.mockReturnValue(mockExtendedPrivateKey)

			const result = await Effect.runPromise(hdKey.getExtendedPrivateKeyEffect(mockHdKey))

			expect(result).toBe(mockExtendedPrivateKey)
			expect(mockGetExtendedPrivateKey).toHaveBeenCalledWith(mockHdKey)
		})

		it('should handle errors properly', async () => {
			const mockHdKey = { privateKey: Bytes.fromHex('0xabcd'), chainCode: Bytes.fromHex('0xefef') }
			const error = new Error('Cannot get extended private key from public key only')

			mockGetExtendedPrivateKey.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(hdKey.getExtendedPrivateKeyEffect(mockHdKey))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})

	describe('getExtendedPublicKeyEffect', () => {
		it('should get the extended public key', async () => {
			const mockHdKey = { privateKey: Bytes.fromHex('0xabcd'), chainCode: Bytes.fromHex('0xefef') }
			const mockExtendedPublicKey = 'xpub661MyMwAqRbcF...'

			mockGetExtendedPublicKey.mockReturnValue(mockExtendedPublicKey)

			const result = await Effect.runPromise(hdKey.getExtendedPublicKeyEffect(mockHdKey))

			expect(result).toBe(mockExtendedPublicKey)
			expect(mockGetExtendedPublicKey).toHaveBeenCalledWith(mockHdKey)
		})

		it('should handle errors properly', async () => {
			const mockHdKey = { privateKey: null, chainCode: Bytes.fromHex('0xefef') }
			const error = new Error('Invalid key')

			mockGetExtendedPublicKey.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(hdKey.getExtendedPublicKeyEffect(mockHdKey))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})

	describe('getAddressEffect', () => {
		it('should get the address from an HD key', async () => {
			const mockHdKey = { privateKey: Bytes.fromHex('0xabcd'), chainCode: Bytes.fromHex('0xefef') }
			const mockAddress = '0x1234567890123456789012345678901234567890'

			mockGetAddress.mockReturnValue(mockAddress)

			const result = await Effect.runPromise(hdKey.getAddressEffect(mockHdKey))

			expect(result).toBe(mockAddress)
			expect(mockGetAddress).toHaveBeenCalledWith(mockHdKey)
		})

		it('should handle errors properly', async () => {
			const mockHdKey = { privateKey: null, chainCode: Bytes.fromHex('0xefef') }
			const error = new Error('Cannot derive address from invalid key')

			mockGetAddress.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(hdKey.getAddressEffect(mockHdKey))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})
})
