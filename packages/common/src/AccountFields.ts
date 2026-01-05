/**
 * Partial account fields that can be modified on an account.
 * Used for partial account updates without replacing the entire account.
 *
 * @example
 * ```typescript
 * import type { AccountFields } from '@tevm/common'
 *
 * const fields: AccountFields = {
 *   balance: 1000000000000000000n, // 1 ETH
 *   nonce: 5n,
 * }
 * ```
 */
export type AccountFields = Partial<{
	/**
	 * The account nonce (number of transactions sent from this account)
	 */
	nonce: bigint
	/**
	 * The account balance in wei
	 */
	balance: bigint
	/**
	 * The Merkle root of the account's storage trie
	 */
	storageRoot: Uint8Array
	/**
	 * The hash of the account's code (empty code has a specific hash)
	 */
	codeHash: Uint8Array
	/**
	 * The size of the account's code in bytes
	 */
	codeSize: number
}>
