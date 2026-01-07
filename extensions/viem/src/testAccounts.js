import { nativeHdAccount } from '@tevm/utils'

const oneToTen = Array.from(Array(10).keys())

export const mnemonic = 'test test test test test test test test test test test junk'

// Using native HD account implementation from @tevm/utils (viem-compatible)
export const testAccounts =
	/**
	 * @type {[import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount, import("@tevm/utils").NativeHDAccount]}
	 */
	(oneToTen.map((i) => nativeHdAccount(mnemonic, { addressIndex: i })))
