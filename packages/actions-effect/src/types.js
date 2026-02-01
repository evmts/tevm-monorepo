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

/**
 * Parameters for setAccount action
 * @typedef {Object} SetAccountParams
 * @property {Address} address - Address of the account to modify
 * @property {bigint} [nonce] - Account nonce to set
 * @property {bigint} [balance] - Account balance to set in wei
 * @property {Hex} [deployedBytecode] - Contract bytecode to deploy
 * @property {Hex} [storageRoot] - Storage root hash to set (32 bytes)
 * @property {Record<Hex, Hex>} [state] - Clear storage first, then set these slots
 * @property {Record<Hex, Hex>} [stateDiff] - Patch existing storage without clearing
 */

/**
 * Successful result of setAccount action
 * @typedef {Object} SetAccountSuccess
 * @property {Address} address - Address of the modified account
 */

/**
 * Parameters for getBalance action (eth_getBalance)
 * @typedef {Object} GetBalanceParams
 * @property {Address} address - Address to query balance for
 * @property {BlockParam} [blockTag] - Block tag to fetch balance from
 */

/**
 * Parameters for getCode action (eth_getCode)
 * @typedef {Object} GetCodeParams
 * @property {Address} address - Address to query code for
 * @property {BlockParam} [blockTag] - Block tag to fetch code from
 */

/**
 * Parameters for getStorageAt action (eth_getStorageAt)
 * @typedef {Object} GetStorageAtParams
 * @property {Address} address - Address of the contract
 * @property {Hex} position - Storage slot position (can be any hex, will be padded to 32 bytes)
 * @property {BlockParam} [blockTag] - Block tag to fetch storage from
 */

// Export empty to make this a module
export {}
