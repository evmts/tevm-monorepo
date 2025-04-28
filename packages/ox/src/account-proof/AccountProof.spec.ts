import { Effect } from 'effect'
import Ox from 'ox'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as AccountProof from './AccountProof.js'

vi.mock('ox', () => {
	return {
		default: {
			AccountProof: {
				parse: vi.fn(),
				verify: vi.fn(),
				verifyStorage: vi.fn(),
			},
		},
	}
})

describe('AccountProof', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('parse', () => {
		it('should parse account proof from raw RPC response successfully', async () => {
			const mockInput = {
				address: '0x1234567890123456789012345678901234567890',
				accountProof: ['0x123', '0x456'],
				balance: '0x0',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				nonce: '0x0',
				storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				storageProof: [],
			}

			const mockResult = {
				address: '0x1234567890123456789012345678901234567890',
				accountProof: [new Uint8Array([0x12, 0x34]), new Uint8Array([0x45, 0x67])],
				balance: 0n,
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				nonce: 0n,
				storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				storageProof: [],
			}

			vi.mocked(Ox.AccountProof.parse).mockReturnValue(mockResult)

			const result = await Effect.runPromise(AccountProof.parse(mockInput))

			expect(Ox.AccountProof.parse).toHaveBeenCalledTimes(1)
			expect(Ox.AccountProof.parse).toHaveBeenCalledWith(mockInput)
			expect(result).toEqual(mockResult)
		})

		it('should handle errors', async () => {
			const mockInput = {
				address: 'invalid-address',
				accountProof: ['0x123'],
				balance: '0x0',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				nonce: '0x0',
				storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				storageProof: [],
			}

			const error = new Error('Invalid address format')
			vi.mocked(Ox.AccountProof.parse).mockImplementation(() => {
				throw error
			})

			const effect = AccountProof.parse(mockInput)

			await expect(Effect.runPromise(effect)).rejects.toThrow(AccountProof.ParseError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'ParseError',
				_tag: 'ParseError',
				cause: error,
			})
		})
	})

	describe('verify', () => {
		it('should verify account proof against state root successfully', async () => {
			const mockOptions = {
				proof: {
					address: '0x1234567890123456789012345678901234567890',
					accountProof: [new Uint8Array([0x12, 0x34]), new Uint8Array([0x45, 0x67])],
					balance: 0n,
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
					nonce: 0n,
					storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					storageProof: [],
				},
				address: '0x1234567890123456789012345678901234567890',
				stateRoot: '0xabcdef',
			}

			vi.mocked(Ox.AccountProof.verify).mockReturnValue(true)

			const result = await Effect.runPromise(AccountProof.verify(mockOptions))

			expect(Ox.AccountProof.verify).toHaveBeenCalledTimes(1)
			expect(Ox.AccountProof.verify).toHaveBeenCalledWith(mockOptions)
			expect(result).toBe(true)
		})

		it('should return false for invalid proof', async () => {
			const mockOptions = {
				proof: {
					address: '0x1234567890123456789012345678901234567890',
					accountProof: [new Uint8Array([0x12, 0x34])],
					balance: 0n,
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
					nonce: 0n,
					storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					storageProof: [],
				},
				address: '0x1234567890123456789012345678901234567890',
				stateRoot: '0xabcdef',
			}

			vi.mocked(Ox.AccountProof.verify).mockReturnValue(false)

			const result = await Effect.runPromise(AccountProof.verify(mockOptions))

			expect(result).toBe(false)
		})

		it('should handle errors', async () => {
			const mockOptions = {
				proof: {
					address: '0x1234567890123456789012345678901234567890',
					accountProof: [],
					balance: 0n,
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
					nonce: 0n,
					storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					storageProof: [],
				},
				address: '0x1234567890123456789012345678901234567890',
				stateRoot: '0xabcdef',
			}

			const error = new Error('Invalid proof format')
			vi.mocked(Ox.AccountProof.verify).mockImplementation(() => {
				throw error
			})

			const effect = AccountProof.verify(mockOptions)

			await expect(Effect.runPromise(effect)).rejects.toThrow(AccountProof.VerifyError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'VerifyError',
				_tag: 'VerifyError',
				cause: error,
			})
		})
	})

	describe('verifyStorage', () => {
		it('should verify storage proof against storage root successfully', async () => {
			const mockOptions = {
				proof: {
					key: '0x1234',
					value: '0x5678',
					proof: [new Uint8Array([0x12, 0x34]), new Uint8Array([0x45, 0x67])],
				},
				storageRoot: '0xabcdef',
				slot: '0x1234',
			}

			vi.mocked(Ox.AccountProof.verifyStorage).mockReturnValue(true)

			const result = await Effect.runPromise(AccountProof.verifyStorage(mockOptions))

			expect(Ox.AccountProof.verifyStorage).toHaveBeenCalledTimes(1)
			expect(Ox.AccountProof.verifyStorage).toHaveBeenCalledWith(mockOptions)
			expect(result).toBe(true)
		})

		it('should return false for invalid storage proof', async () => {
			const mockOptions = {
				proof: {
					key: '0x1234',
					value: '0x5678',
					proof: [new Uint8Array([0x12, 0x34])],
				},
				storageRoot: '0xabcdef',
				slot: '0x1234',
			}

			vi.mocked(Ox.AccountProof.verifyStorage).mockReturnValue(false)

			const result = await Effect.runPromise(AccountProof.verifyStorage(mockOptions))

			expect(result).toBe(false)
		})

		it('should handle errors', async () => {
			const mockOptions = {
				proof: {
					key: '0x1234',
					value: '0x5678',
					proof: [],
				},
				storageRoot: '0xabcdef',
				slot: '0x1234',
			}

			const error = new Error('Invalid storage proof format')
			vi.mocked(Ox.AccountProof.verifyStorage).mockImplementation(() => {
				throw error
			})

			const effect = AccountProof.verifyStorage(mockOptions)

			await expect(Effect.runPromise(effect)).rejects.toThrow(AccountProof.VerifyStorageError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'VerifyStorageError',
				_tag: 'VerifyStorageError',
				cause: error,
			})
		})
	})
})
