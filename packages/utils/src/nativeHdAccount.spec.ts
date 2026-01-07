import { describe, it, expect } from 'vitest'
import { nativeHdAccount } from './nativeHdAccount.js'
import { mnemonicToAccount } from 'viem/accounts'

const TEST_MNEMONIC = 'test test test test test test test test test test test junk'

describe('nativeHdAccount', () => {
	describe('basic functionality', () => {
		it('should create an account from a valid mnemonic', () => {
			const account = nativeHdAccount(TEST_MNEMONIC)
			expect(account.address).toBeDefined()
			expect(account.address.startsWith('0x')).toBe(true)
			expect(account.address.length).toBe(42)
		})

		it('should have source set to "hd"', () => {
			const account = nativeHdAccount(TEST_MNEMONIC)
			expect(account.source).toBe('hd')
		})

		it('should have type set to "local"', () => {
			const account = nativeHdAccount(TEST_MNEMONIC)
			expect(account.type).toBe('local')
		})

		it('should have publicKey', () => {
			const account = nativeHdAccount(TEST_MNEMONIC)
			expect(account.publicKey).toBeDefined()
			expect(account.publicKey.startsWith('0x')).toBe(true)
		})

		it('should throw on invalid mnemonic', () => {
			expect(() => nativeHdAccount('invalid mnemonic')).toThrow('Invalid mnemonic phrase')
		})
	})

	describe('viem compatibility', () => {
		it('should derive the same address as viem for default options', () => {
			const native = nativeHdAccount(TEST_MNEMONIC)
			const viem = mnemonicToAccount(TEST_MNEMONIC)
			expect(native.address).toBe(viem.address)
		})

		it('should derive the same address as viem for different addressIndex', () => {
			for (let i = 0; i < 5; i++) {
				const native = nativeHdAccount(TEST_MNEMONIC, { addressIndex: i })
				const viem = mnemonicToAccount(TEST_MNEMONIC, { addressIndex: i })
				expect(native.address).toBe(viem.address)
			}
		})

		it('should derive the same address as viem for different accountIndex', () => {
			for (let i = 0; i < 3; i++) {
				const native = nativeHdAccount(TEST_MNEMONIC, { accountIndex: i })
				const viem = mnemonicToAccount(TEST_MNEMONIC, { accountIndex: i })
				expect(native.address).toBe(viem.address)
			}
		})
	})

	describe('signing', () => {
		it('should sign a message with the same result as viem', async () => {
			const native = nativeHdAccount(TEST_MNEMONIC)
			const viem = mnemonicToAccount(TEST_MNEMONIC)
			const message = 'Hello, Ethereum!'
			const nativeSig = await native.signMessage({ message })
			const viemSig = await viem.signMessage({ message })
			expect(nativeSig).toBe(viemSig)
		})

		it('should sign a hash', async () => {
			const account = nativeHdAccount(TEST_MNEMONIC)
			const hash = '0x1234567890123456789012345678901234567890123456789012345678901234' as const
			const signature = await account.sign({ hash })
			expect(signature).toBeDefined()
			expect(signature.startsWith('0x')).toBe(true)
		})

		it('should sign typed data with same result as viem', async () => {
			const native = nativeHdAccount(TEST_MNEMONIC)
			const viem = mnemonicToAccount(TEST_MNEMONIC)

			const typedData = {
				domain: {
					name: 'Test',
					version: '1',
					chainId: 1,
				},
				types: {
					Person: [
						{ name: 'name', type: 'string' },
						{ name: 'wallet', type: 'address' },
					],
				},
				primaryType: 'Person' as const,
				message: {
					name: 'Bob',
					wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
			}

			const nativeSig = await native.signTypedData(typedData)
			const viemSig = await viem.signTypedData(typedData)
			expect(nativeSig).toBe(viemSig)
		})
	})

	describe('getAccount helper', () => {
		it('should get an account at a specific index', () => {
			const account = nativeHdAccount(TEST_MNEMONIC)
			const account1 = account.getAccount(1)
			const expected = nativeHdAccount(TEST_MNEMONIC, { addressIndex: 1 })
			expect(account1.address).toBe(expected.address)
		})

		it('should return different addresses for different indices', () => {
			const account = nativeHdAccount(TEST_MNEMONIC)
			const addresses = [0, 1, 2, 3, 4].map(i => account.getAccount(i).address)
			const uniqueAddresses = new Set(addresses)
			expect(uniqueAddresses.size).toBe(5)
		})
	})
})
