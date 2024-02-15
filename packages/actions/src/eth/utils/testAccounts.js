import { mnemonicToAccount } from '@tevm/utils'

const oneToTen = Array.from(Array(10).keys())

export const mnemonic =
	'test test test test test test test test test test test junk'

export const testAccounts =
	/**
	 * @type {[import("@tevm/utils").HDAccount, import("@tevm/utils").HDAccount,import("@tevm/utils").HDAccount, import("@tevm/utils").HDAccount,import("@tevm/utils").HDAccount, import("@tevm/utils").HDAccount,import("@tevm/utils").HDAccount, import("@tevm/utils").HDAccount,import("@tevm/utils").HDAccount, import("@tevm/utils").HDAccount]}
	 */
	(oneToTen.map((i) => mnemonicToAccount(mnemonic, { addressIndex: i })))
