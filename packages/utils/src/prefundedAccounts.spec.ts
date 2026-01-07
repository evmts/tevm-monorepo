import type { Address } from './abitype.js'
// Use native mnemonicToAccount (viem-compatible, no viem dependency)
import { nativeMnemonicToAccount } from './nativeMnemonicToAccount.js'
import { describe, expect, it } from 'vitest'
import {
	PREFUNDED_ACCOUNTS,
	PREFUNDED_PRIVATE_KEYS,
	PREFUNDED_PUBLIC_KEYS,
	PREFUNDED_SEED,
} from './prefundedAccounts.js'
import { privateKeyToAddress } from './privateKeyToAddress.js'

describe('prefundedAccounts', () => {
	it('has constants for the 10 prefunded accounts. Thesea re same accounts anvil and hardhat use', () => {
		for (let i = 0; i < 10; i++) {
			const { address } = nativeMnemonicToAccount(PREFUNDED_SEED.mnemonic, {
				addressIndex: i,
			})
			expect(privateKeyToAddress(PREFUNDED_PRIVATE_KEYS[i] as Address)).toBe(address)
			expect(PREFUNDED_PUBLIC_KEYS[i] as Address).toBe(address)
			expect(PREFUNDED_ACCOUNTS[i]?.address).toBe(address)
		}
	})
})
