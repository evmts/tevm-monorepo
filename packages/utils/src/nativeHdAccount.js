// Native HD account implementation using @scure/bip39 and @scure/bip32
// This provides a viem-compatible HDAccount from a mnemonic phrase
// Uses pure JS libraries (no FFI/native dependencies)
//
// Note: @tevm/voltaire has Bip39 and HDWallet modules that wrap @scure,
// but importing them pulls in FFI dependencies due to module structure.
// Direct @scure usage avoids this and is equally correct since voltaire
// internally uses @scure for the same functionality.

import { validateMnemonic, mnemonicToSeedSync } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import { HDKey } from '@scure/bip32'
import { nativePrivateKeyToAccount } from './nativePrivateKeyToAccount.js'
import { bytesToHex } from './viem.js'

/**
 * Creates a viem-compatible HD account object from a mnemonic phrase.
 *
 * This implementation uses `source: 'hd'` to match viem's HDAccount type,
 * making it a drop-in replacement for viem's mnemonicToAccount.
 *
 * @param {string} mnemonic - The BIP-39 mnemonic phrase (12, 15, 18, 21, or 24 words)
 * @param {Object} [options] - Options for account derivation
 * @param {number} [options.accountIndex] - The account index to derive (default: 0)
 * @param {number} [options.addressIndex] - The address index to derive (default: 0)
 * @param {number} [options.changeIndex] - The change index (0 for external, 1 for internal, default: 0)
 * @param {string} [options.path] - Custom derivation path (overrides accountIndex/addressIndex/changeIndex)
 * @param {string} [options.passphrase] - Optional BIP-39 passphrase
 * @returns {import('./account-types.js').NativeHDAccount} A viem-compatible HD account object
 * @throws {Error} If the mnemonic is invalid
 * @example
 * ```javascript
 * import { nativeHdAccount } from '@tevm/utils'
 *
 * const account = nativeHdAccount('test test test test test test test test test test test junk')
 * console.log(account.address) // '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 * console.log(account.source) // 'hd'
 *
 * // Sign a message
 * const signature = await account.signMessage({ message: 'Hello, Ethereum!' })
 *
 * // Get account at different index
 * const account1 = account.getAccount(1)
 * ```
 */
export function nativeHdAccount(mnemonic, options = {}) {
	// Validate mnemonic using @scure/bip39
	if (!validateMnemonic(mnemonic, wordlist)) {
		throw new Error('Invalid mnemonic phrase')
	}

	const {
		accountIndex = 0,
		addressIndex = 0,
		changeIndex = 0,
		path,
		passphrase = '',
	} = options

	// Derive seed from mnemonic using BIP-39 (@scure/bip39)
	const seed = mnemonicToSeedSync(mnemonic, passphrase)

	// Create HD wallet root from seed using @scure/bip32
	const root = HDKey.fromMasterSeed(seed)

	// Use custom path or build standard Ethereum path (BIP-44: m/44'/60'/account'/change/addressIndex)
	const derivationPath = path || `m/44'/60'/${accountIndex}'/${changeIndex}/${addressIndex}`

	// Derive the key at the specified path
	const derived = root.derive(derivationPath)

	// Get private key bytes
	const privateKeyBytes = derived.privateKey
	if (!privateKeyBytes) {
		throw new Error('Failed to derive private key from mnemonic')
	}

	// Convert to hex for the native account
	const privateKeyHex = /** @type {import('./hex-types.js').Hex} */ (bytesToHex(privateKeyBytes))

	// Create the underlying account using our native private key implementation
	const baseAccount = nativePrivateKeyToAccount(privateKeyHex)

	/**
	 * Get an account at a specific address index (keeping the same account index)
	 * @param {number} index - The address index
	 * @returns {import('./account-types.js').NativeHDAccount}
	 */
	function getAccount(index) {
		return nativeHdAccount(mnemonic, {
			accountIndex,
			addressIndex: index,
			changeIndex,
			passphrase,
		})
	}

	return {
		address: baseAccount.address,
		publicKey: baseAccount.publicKey,
		type: /** @type {const} */ ('local'),
		source: /** @type {const} */ ('hd'),
		sign: baseAccount.sign,
		signMessage: baseAccount.signMessage,
		signTransaction: baseAccount.signTransaction,
		signTypedData: baseAccount.signTypedData,
		getAccount,
	}
}
