import { describe, expect, it } from 'vitest'
import { nativeMnemonicToAccount } from './nativeMnemonicToAccount.js'
import { mnemonicToAccount } from 'viem/accounts'
// Using native implementations for verification - migrated from viem
import {
	recoverAddress,
	verifyMessage,
	verifyTypedData,
	hashMessage,
	keccak256,
	toHex,
	toBytes,
} from './index.js'
import type { Address, Hex } from './abitype.js'

/**
 * Helper to convert a 65-byte hex signature to { r, s, v } format
 */
function parseSignature(sig: Hex): { r: bigint; s: bigint; v: number } {
	return {
		r: BigInt(`0x${sig.slice(2, 66)}`),
		s: BigInt(`0x${sig.slice(66, 130)}`),
		v: parseInt(sig.slice(130, 132), 16),
	}
}

/**
 * Helper to hash a message for raw bytes
 */
function hashRawMessage(rawHex: Hex): Hex {
	const bytes = toBytes(rawHex)
	const prefix = `\x19Ethereum Signed Message:\n${bytes.length}`
	const prefixBytes = new TextEncoder().encode(prefix)
	const combined = new Uint8Array(prefixBytes.length + bytes.length)
	combined.set(prefixBytes)
	combined.set(bytes, prefixBytes.length)
	return keccak256(combined)
}

// Standard test mnemonic from Hardhat/Foundry
const TEST_MNEMONIC = 'test test test test test test test test test test test junk'

describe('nativeMnemonicToAccount', () => {
	describe('basic functionality', () => {
		it('should derive the correct address for index 0', () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)
			// This is the first Hardhat/Foundry test account address
			expect(account.address.toLowerCase()).toBe('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
		})

		it('should derive different addresses for different indices', () => {
			const account0 = nativeMnemonicToAccount(TEST_MNEMONIC, { addressIndex: 0 })
			const account1 = nativeMnemonicToAccount(TEST_MNEMONIC, { addressIndex: 1 })
			expect(account0.address).not.toBe(account1.address)
		})

		it('should have correct type and source', () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)
			expect(account.type).toBe('local')
			expect(account.source).toBe('mnemonic')
		})

		it('should have a valid public key', () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)
			// Public key should be 65 bytes (0x04 + 64 bytes) = 130 hex chars + 0x prefix
			expect(account.publicKey.startsWith('0x04')).toBe(true)
			expect(account.publicKey.length).toBe(132)
		})

		it('should throw for invalid mnemonic', () => {
			expect(() => nativeMnemonicToAccount('invalid mnemonic phrase')).toThrow('Invalid mnemonic phrase')
		})
	})

	describe('viem compatibility', () => {
		it('should derive the same address as viem', () => {
			const nativeAccount = nativeMnemonicToAccount(TEST_MNEMONIC)
			const viemAccount = mnemonicToAccount(TEST_MNEMONIC)
			expect(nativeAccount.address.toLowerCase()).toBe(viemAccount.address.toLowerCase())
		})

		it('should derive the same address for different indices', () => {
			for (let i = 0; i < 5; i++) {
				const nativeAccount = nativeMnemonicToAccount(TEST_MNEMONIC, { addressIndex: i })
				const viemAccount = mnemonicToAccount(TEST_MNEMONIC, { addressIndex: i })
				expect(nativeAccount.address.toLowerCase()).toBe(viemAccount.address.toLowerCase())
			}
		})

		it('should derive the same address for different account indices', () => {
			for (let i = 0; i < 3; i++) {
				const nativeAccount = nativeMnemonicToAccount(TEST_MNEMONIC, { accountIndex: i })
				const viemAccount = mnemonicToAccount(TEST_MNEMONIC, { accountIndex: i })
				expect(nativeAccount.address.toLowerCase()).toBe(viemAccount.address.toLowerCase())
			}
		})
	})

	describe('signing', () => {
		it('should sign a message that can be verified', async () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)
			const message = 'Hello, Ethereum!'

			const signature = await account.signMessage({ message })
			const parsedSig = parseSignature(signature)

			// Verify using native implementation
			const isValid = verifyMessage({
				address: account.address as Address,
				message,
				signature: parsedSig,
			})
			expect(isValid).toBe(true)
		})

		it('should sign a raw message that can be verified', async () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)
			const rawMessage = '0x1234567890abcdef' as Hex

			const signature = await account.signMessage({ message: { raw: rawMessage } })
			const parsedSig = parseSignature(signature)

			// Hash the raw message and verify by recovering address
			const hash = hashRawMessage(rawMessage)
			const recoveredAddress = recoverAddress({
				hash,
				signature: parsedSig,
			})
			expect(recoveredAddress.toLowerCase()).toBe(account.address.toLowerCase())
		})

		it('should sign a hash directly that can be recovered', async () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)
			const hash = keccak256(toHex('Hello, Ethereum!'))

			const signature = await account.sign({ hash })
			const parsedSig = parseSignature(signature)

			// Recover the address using native implementation
			const recoveredAddress = recoverAddress({
				hash,
				signature: parsedSig,
			})
			expect(recoveredAddress.toLowerCase()).toBe(account.address.toLowerCase())
		})

		it('should sign typed data (EIP-712) that can be verified', async () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)

			const domain = {
				name: 'Test',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as const,
			}
			const types = {
				Person: [
					{ name: 'name', type: 'string' },
					{ name: 'wallet', type: 'address' },
				],
			}
			const primaryType = 'Person' as const
			const message = {
				name: 'Alice',
				wallet: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as const,
			}

			const signature = await account.signTypedData({
				domain,
				types,
				primaryType,
				message,
			})
			const parsedSig = parseSignature(signature)

			// Verify using native implementation
			const isValid = verifyTypedData({
				address: account.address as Address,
				typedData: {
					domain,
					types,
					primaryType,
					message,
				},
				signature: parsedSig,
			})
			expect(isValid).toBe(true)
		})
	})

	describe('getAccount helper', () => {
		it('should return accounts at different indices', () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)
			const account0 = account.getAccount(0)
			const account1 = account.getAccount(1)
			const account2 = account.getAccount(2)

			expect(account0.address).toBe(account.address) // Same as default
			expect(account1.address).not.toBe(account0.address)
			expect(account2.address).not.toBe(account1.address)
		})

		it('should match viem addresses via getAccount', () => {
			const account = nativeMnemonicToAccount(TEST_MNEMONIC)

			for (let i = 0; i < 5; i++) {
				const nativeAccount = account.getAccount(i)
				const viemAccount = mnemonicToAccount(TEST_MNEMONIC, { addressIndex: i })
				expect(nativeAccount.address.toLowerCase()).toBe(viemAccount.address.toLowerCase())
			}
		})
	})

	describe('passphrase support', () => {
		it('should derive different addresses with passphrase', () => {
			const accountNoPass = nativeMnemonicToAccount(TEST_MNEMONIC)
			const accountWithPass = nativeMnemonicToAccount(TEST_MNEMONIC, { passphrase: 'secret' })
			expect(accountNoPass.address).not.toBe(accountWithPass.address)
		})
	})

	describe('custom path', () => {
		it('should support custom derivation paths', () => {
			// Standard Ethereum path for account 0
			const standardAccount = nativeMnemonicToAccount(TEST_MNEMONIC, {
				path: "m/44'/60'/0'/0/0",
			})
			// Should match default derivation
			const defaultAccount = nativeMnemonicToAccount(TEST_MNEMONIC)
			expect(standardAccount.address.toLowerCase()).toBe(defaultAccount.address.toLowerCase())
		})

		it('should derive different addresses with different paths', () => {
			const path1 = nativeMnemonicToAccount(TEST_MNEMONIC, { path: "m/44'/60'/0'/0/0" })
			const path2 = nativeMnemonicToAccount(TEST_MNEMONIC, { path: "m/44'/60'/0'/0/1" })
			const path3 = nativeMnemonicToAccount(TEST_MNEMONIC, { path: "m/44'/60'/1'/0/0" })
			expect(path1.address).not.toBe(path2.address)
			expect(path1.address).not.toBe(path3.address)
			expect(path2.address).not.toBe(path3.address)
		})
	})
})
