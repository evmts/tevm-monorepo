import { mnemonicToAccount } from 'viem/accounts'

const oneToTen = Array.from(Array(10).keys())

export const mnemonic =
	'test test test test test test test test test test test junk'

export const testAccounts =
	/**
	 * @type {[import("viem").HDAccount, import("viem").HDAccount,import("viem").HDAccount, import("viem").HDAccount,import("viem").HDAccount, import("viem").HDAccount,import("viem").HDAccount, import("viem").HDAccount,import("viem").HDAccount, import("viem").HDAccount]}
	 */
	(oneToTen.map((i) => mnemonicToAccount(mnemonic, { addressIndex: i })))
