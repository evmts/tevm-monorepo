// Native mnemonicToAccount implementation using @scure/bip39 and @scure/bip32
// This provides a viem-compatible account object from a mnemonic phrase
// Uses pure JS libraries (no FFI/native dependencies) - same libraries used by viem

import { validateMnemonic, mnemonicToSeedSync } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import { HDKey } from '@scure/bip32'
import { nativePrivateKeyToAccount } from './nativePrivateKeyToAccount.js'
import { bytesToHex } from './viem.js'

/**
 * @typedef {Object} NativeMnemonicAccount
 * @property {import('./address-types.js').Address} address - The checksummed Ethereum address
 * @property {import('./hex-types.js').Hex} publicKey - The uncompressed public key (65 bytes with 0x04 prefix)
 * @property {'local'} type - Account type, always 'local' for mnemonic accounts
 * @property {'mnemonic'} source - Account source, always 'mnemonic'
 * @property {(parameters: { hash: import('./hex-types.js').Hex }) => Promise<import('./hex-types.js').Hex>} sign - Sign a hash directly
 * @property {(parameters: { message: string | { raw: import('./hex-types.js').Hex | Uint8Array } }) => Promise<import('./hex-types.js').Hex>} signMessage - Sign a message with EIP-191 prefix
 * @property {(transaction: any) => Promise<any>} signTransaction - Sign a transaction (returns signed tx object)
 * @property {(parameters: { domain?: any, types: any, primaryType: string, message: any }) => Promise<import('./hex-types.js').Hex>} signTypedData - Sign typed data (EIP-712)
 * @property {(index: number) => NativeMnemonicAccount} getAccount - Get an account at a specific index
 */

/**
 * Creates a viem-compatible account object from a mnemonic phrase using native implementation.
 *
 * This is a native implementation that doesn't depend on viem for HD derivation or signing,
 * using @scure/bip39 for seed generation, @scure/bip32 for key derivation, and @tevm/voltaire for signing.
 *
 * @param {string} mnemonic - The BIP-39 mnemonic phrase (12, 15, 18, 21, or 24 words)
 * @param {Object} [options] - Options for account derivation
 * @param {number} [options.accountIndex] - The account index to derive (default: 0)
 * @param {number} [options.addressIndex] - The address index to derive (default: 0)
 * @param {number} [options.changeIndex] - The change index (0 for external, 1 for internal, default: 0)
 * @param {string} [options.path] - Custom derivation path (overrides accountIndex/addressIndex/changeIndex)
 * @param {string} [options.passphrase] - Optional BIP-39 passphrase
 * @returns {NativeMnemonicAccount} A viem-compatible account object
 * @throws {Error} If the mnemonic is invalid
 * @example
 * ```javascript
 * import { nativeMnemonicToAccount } from '@tevm/utils'
 *
 * const account = nativeMnemonicToAccount('test test test test test test test test test test test junk')
 * console.log(account.address) // '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 *
 * // Sign a message
 * const signature = await account.signMessage({ message: 'Hello, Ethereum!' })
 *
 * // Get account at different index
 * const account1 = account.getAccount(1)
 * ```
 */
export function nativeMnemonicToAccount(mnemonic, options = {}) {
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
	 * @returns {NativeMnemonicAccount}
	 */
	function getAccount(index) {
		return nativeMnemonicToAccount(mnemonic, {
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
		source: /** @type {const} */ ('mnemonic'),
		sign: baseAccount.sign,
		signMessage: baseAccount.signMessage,
		signTransaction: baseAccount.signTransaction,
		signTypedData: baseAccount.signTypedData,
		getAccount,
	}
}
