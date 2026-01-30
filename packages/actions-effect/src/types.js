/**
 * @module @tevm/actions-effect/types
 * @description Type definitions for Effect-based action handlers
 */

/**
 * Hex string type
 * @typedef {`0x${string}`} Hex
 */

/**
 * Address type (a Hex string representing an Ethereum address)
 * @typedef {Hex} Address
 */

/**
 * Block parameter for specifying which block to query
 * @typedef {bigint | Hex | 'latest' | 'earliest' | 'pending' | 'forked' | 'safe' | 'finalized'} BlockParam
 */

/**
 * Parameters for getAccount action
 * @typedef {Object} GetAccountParams
 * @property {Address} address - Address of the account to query
 * @property {BlockParam} [blockTag] - Block tag to fetch account from
 * @property {boolean} [returnStorage] - If true, returns contract storage (expensive operation)
 */

/**
 * Successful result of getAccount action
 * @typedef {Object} GetAccountSuccess
 * @property {Address} address - Address of the account
 * @property {bigint} nonce - Account nonce
 * @property {bigint} balance - Account balance in wei
 * @property {Hex} deployedBytecode - Contract bytecode (empty for EOA)
 * @property {Hex} storageRoot - Storage root hash
 * @property {Hex} codeHash - Code hash
 * @property {boolean} isContract - True if account has code
 * @property {boolean} isEmpty - True if account is empty (no balance, nonce, code)
 * @property {Record<Hex, Hex>} [storage] - Contract storage (if returnStorage=true)
 */

// Export empty to make this a module
export {}
