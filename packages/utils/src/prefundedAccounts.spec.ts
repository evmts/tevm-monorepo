import type { Address } from './abitype.js'
import { mnemonicToAccount } from 'viem/accounts'
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
			const { address } = mnemonicToAccount(PREFUNDED_SEED.mnemonic, {
				addressIndex: i,
			})
			expect(privateKeyToAddress(PREFUNDED_PRIVATE_KEYS[i] as Address)).toBe(address)
			expect(PREFUNDED_PUBLIC_KEYS[i] as Address).toBe(address)
			expect(PREFUNDED_ACCOUNTS[i]?.address).toBe(address)
		}
	})
})
