import type { Address } from './address-types.js'
import type { Hex } from './hex-types.js'

/**
 * Sign parameters for signing a hash directly.
 */
export type SignParameters = {
	hash: Hex
}

/**
 * Sign message parameters supporting both string and raw bytes.
 */
export type SignMessageParameters = {
	message: string | { raw: Hex | Uint8Array }
}

/**
 * Typed data parameters for EIP-712 signing.
 */
export type SignTypedDataParameters = {
	domain?: {
		chainId?: number
		name?: string
		salt?: Hex
		verifyingContract?: Address
		version?: string
	}
	types: Record<string, Array<{ name: string; type: string }>>
	primaryType: string
	message: Record<string, unknown>
}

/**
 * Base local account interface - used by both privateKey and mnemonic accounts.
 * This is compatible with viem's LocalAccount type.
 */
export type LocalAccount<TSource extends string = string> = {
	/** The checksummed Ethereum address */
	address: Address
	/** The uncompressed public key (65 bytes with 0x04 prefix) */
	publicKey: Hex
	/** Account type - always 'local' for local accounts */
	type: 'local'
	/** Source of the account (e.g., 'privateKey', 'mnemonic', 'hd') */
	source: TSource
	/** Sign a hash directly (returns 65-byte signature with v, r, s) */
	sign: (parameters: SignParameters) => Promise<Hex>
	/** Sign a message with EIP-191 prefix */
	signMessage: (parameters: SignMessageParameters) => Promise<Hex>
	/** Sign a transaction (returns serialized signed transaction) */
	signTransaction: (transaction: unknown) => Promise<Hex>
	/** Sign typed data (EIP-712) */
	signTypedData: (parameters: SignTypedDataParameters) => Promise<Hex>
}

/**
 * Native private key account - created from a private key.
 * Compatible with viem's PrivateKeyAccount type.
 */
export type NativePrivateKeyAccount = LocalAccount<'privateKey'>

/**
 * Native mnemonic account - created from a BIP-39 mnemonic phrase.
 * Includes a getAccount helper to derive accounts at different indices.
 */
export type NativeMnemonicAccount = LocalAccount<'mnemonic'> & {
	/** Get an account at a specific address index */
	getAccount: (index: number) => NativeMnemonicAccount
}

/**
 * Native HD account - created from a mnemonic with HD key access.
 * Compatible with viem's HDAccount type (source: 'hd').
 */
export type NativeHDAccount = LocalAccount<'hd'> & {
	/** Get an account at a specific address index */
	getAccount: (index: number) => NativeHDAccount
}

/**
 * Union of all native account types.
 * Use this when you need to accept any local account.
 */
export type NativeAccount = NativePrivateKeyAccount | NativeMnemonicAccount | NativeHDAccount
