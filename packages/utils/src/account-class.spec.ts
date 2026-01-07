import { describe, expect, it } from 'vitest'
import { Account, createAccount } from './account-class.js'
import { KECCAK256_RLP_BYTES, KECCAK256_NULL_BYTES, BIGINT_0 } from './constants.js'
import { equalsBytes } from './equalsBytes.js'

describe('Account', () => {
	describe('constructor', () => {
		it('should create an empty account with default values', () => {
			const account = new Account()

			expect(account.nonce).toBe(0n)
			expect(account.balance).toBe(0n)
			expect(equalsBytes(account.storageRoot, KECCAK256_RLP_BYTES)).toBe(true)
			expect(equalsBytes(account.codeHash, KECCAK256_NULL_BYTES)).toBe(true)
			expect(account.version).toBe(0)
		})

		it('should create an account with specified nonce and balance', () => {
			const account = new Account(5n, 1000000000000000000n)

			expect(account.nonce).toBe(5n)
			expect(account.balance).toBe(1000000000000000000n)
		})

		it('should create an account with custom storage root and code hash', () => {
			const customStorageRoot = new Uint8Array(32).fill(1)
			const customCodeHash = new Uint8Array(32).fill(2)

			const account = new Account(0n, 0n, customStorageRoot, customCodeHash)

			expect(equalsBytes(account.storageRoot, customStorageRoot)).toBe(true)
			expect(equalsBytes(account.codeHash, customCodeHash)).toBe(true)
		})

		it('should throw for negative nonce', () => {
			expect(() => new Account(-1n)).toThrow('nonce must be >= 0')
		})

		it('should throw for negative balance', () => {
			expect(() => new Account(0n, -1n)).toThrow('balance must be >= 0')
		})
	})

	describe('isEmpty', () => {
		it('should return true for empty account', () => {
			const account = new Account()
			expect(account.isEmpty()).toBe(true)
		})

		it('should return false when nonce is non-zero', () => {
			const account = new Account(1n)
			expect(account.isEmpty()).toBe(false)
		})

		it('should return false when balance is non-zero', () => {
			const account = new Account(0n, 1n)
			expect(account.isEmpty()).toBe(false)
		})
	})

	describe('isContract', () => {
		it('should return false for EOA (empty code hash)', () => {
			const account = new Account()
			expect(account.isContract()).toBe(false)
		})

		it('should return true when code hash is different from KECCAK256_NULL', () => {
			const customCodeHash = new Uint8Array(32).fill(1)
			const account = new Account(0n, 0n, undefined, customCodeHash)
			expect(account.isContract()).toBe(true)
		})
	})

	describe('raw', () => {
		it('should return array of raw values', () => {
			const account = new Account()
			const raw = account.raw()

			expect(raw.length).toBe(4)
			expect(raw[0]).toEqual(new Uint8Array(0)) // nonce = 0
			expect(raw[1]).toEqual(new Uint8Array(0)) // balance = 0
			expect(equalsBytes(raw[2], KECCAK256_RLP_BYTES)).toBe(true)
			expect(equalsBytes(raw[3], KECCAK256_NULL_BYTES)).toBe(true)
		})

		it('should encode non-zero nonce and balance correctly', () => {
			const account = new Account(1n, 100n)
			const raw = account.raw()

			expect(raw[0]).toEqual(new Uint8Array([1])) // nonce = 1
			expect(raw[1]).toEqual(new Uint8Array([100])) // balance = 100
		})
	})

	describe('serialize', () => {
		it('should return RLP encoded account', () => {
			const account = new Account()
			const serialized = account.serialize()

			expect(serialized).toBeInstanceOf(Uint8Array)
			expect(serialized.length).toBeGreaterThan(0)
		})

		it('should produce consistent serialization', () => {
			const account1 = new Account(1n, 100n)
			const account2 = new Account(1n, 100n)

			expect(equalsBytes(account1.serialize(), account2.serialize())).toBe(true)
		})

		it('should produce different serialization for different accounts', () => {
			const account1 = new Account(1n, 100n)
			const account2 = new Account(2n, 100n)

			expect(equalsBytes(account1.serialize(), account2.serialize())).toBe(false)
		})
	})

	describe('serializeWithPartialInfo', () => {
		it('should return RLP encoded partial account', () => {
			const account = new Account(1n, 100n, undefined, undefined, 256)
			const serialized = account.serializeWithPartialInfo()

			expect(serialized).toBeInstanceOf(Uint8Array)
			expect(serialized.length).toBeGreaterThan(0)
		})
	})

	describe('version', () => {
		it('should default to 0', () => {
			const account = new Account()
			expect(account.version).toBe(0)
		})

		it('should be set by constructor', () => {
			const account = new Account(0n, 0n, undefined, undefined, undefined, 1)
			expect(account.version).toBe(1)
		})
	})

	describe('codeSize', () => {
		it('should be undefined by default', () => {
			const account = new Account()
			expect(account.codeSize).toBeUndefined()
		})

		it('should be set by constructor', () => {
			const account = new Account(0n, 0n, undefined, undefined, 256)
			expect(account.codeSize).toBe(256)
		})
	})
})

describe('createAccount', () => {
	it('should create empty account with no arguments', () => {
		const account = createAccount()

		expect(account.nonce).toBe(0n)
		expect(account.balance).toBe(0n)
		expect(account.isEmpty()).toBe(true)
	})

	it('should create account from object with nonce and balance', () => {
		const account = createAccount({ nonce: 5n, balance: 1000000000000000000n })

		expect(account.nonce).toBe(5n)
		expect(account.balance).toBe(1000000000000000000n)
	})

	it('should create account with custom storage root', () => {
		const customStorageRoot = new Uint8Array(32).fill(1)
		const account = createAccount({ storageRoot: customStorageRoot })

		expect(equalsBytes(account.storageRoot, customStorageRoot)).toBe(true)
	})

	it('should create account with custom code hash', () => {
		const customCodeHash = new Uint8Array(32).fill(2)
		const account = createAccount({ codeHash: customCodeHash })

		expect(equalsBytes(account.codeHash, customCodeHash)).toBe(true)
		expect(account.isContract()).toBe(true)
	})

	it('should create account with code size', () => {
		const account = createAccount({ codeSize: 512 })

		expect(account.codeSize).toBe(512)
	})

	it('should create account with version', () => {
		const account = createAccount({ version: 1 })

		expect(account.version).toBe(1)
	})

	it('should create account with all properties', () => {
		const customStorageRoot = new Uint8Array(32).fill(1)
		const customCodeHash = new Uint8Array(32).fill(2)

		const account = createAccount({
			nonce: 10n,
			balance: 5000000000000000000n,
			storageRoot: customStorageRoot,
			codeHash: customCodeHash,
			codeSize: 1024,
			version: 1
		})

		expect(account.nonce).toBe(10n)
		expect(account.balance).toBe(5000000000000000000n)
		expect(equalsBytes(account.storageRoot, customStorageRoot)).toBe(true)
		expect(equalsBytes(account.codeHash, customCodeHash)).toBe(true)
		expect(account.codeSize).toBe(1024)
		expect(account.version).toBe(1)
	})
})

describe('Account setters', () => {
	it('should allow setting nonce', () => {
		const account = new Account()
		expect(account.nonce).toBe(0n)

		account.nonce = 5n
		expect(account.nonce).toBe(5n)

		account.nonce = 100n
		expect(account.nonce).toBe(100n)
	})

	it('should allow setting balance', () => {
		const account = new Account()
		expect(account.balance).toBe(0n)

		account.balance = 1000000000000000000n
		expect(account.balance).toBe(1000000000000000000n)

		account.balance = 0n
		expect(account.balance).toBe(0n)
	})

	it('should update isEmpty after setting nonce', () => {
		const account = new Account()
		expect(account.isEmpty()).toBe(true)

		account.nonce = 1n
		expect(account.isEmpty()).toBe(false)
	})

	it('should update isEmpty after setting balance', () => {
		const account = new Account()
		expect(account.isEmpty()).toBe(true)

		account.balance = 1n
		expect(account.isEmpty()).toBe(false)
	})
})

describe('compatibility with ethereumjs Account', () => {
	it('should produce correct serialization for empty account', () => {
		// Expected RLP encoding for empty account from ethereumjs
		// f8448080a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
		const account = new Account()
		const serialized = account.serialize()

		// Check the serialized bytes match the expected format
		// The RLP encoding should start with f844 (list with 68 bytes)
		expect(serialized[0]).toBe(0xf8)
		expect(serialized[1]).toBe(0x44)
	})

	it('should have proper getters like ethereumjs Account', () => {
		const account = new Account(1n, 100n)

		// These are getters, not methods
		expect(typeof account.nonce).toBe('bigint')
		expect(typeof account.balance).toBe('bigint')
		expect(account.storageRoot).toBeInstanceOf(Uint8Array)
		expect(account.codeHash).toBeInstanceOf(Uint8Array)
	})
})
