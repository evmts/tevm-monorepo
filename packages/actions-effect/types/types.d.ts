/**
 * Hex string type
 */
export type Hex = `0x${string}`;
/**
 * Address type (a Hex string representing an Ethereum address)
 */
export type Address = Hex;
/**
 * Block parameter for specifying which block to query
 */
export type BlockParam = bigint | Hex | "latest" | "earliest" | "pending" | "forked" | "safe" | "finalized";
/**
 * Parameters for getAccount action
 */
export type GetAccountParams = {
    /**
     * - Address of the account to query
     */
    address: Address;
    /**
     * - Block tag to fetch account from
     */
    blockTag?: BlockParam;
    /**
     * - If true, returns contract storage (expensive operation)
     */
    returnStorage?: boolean;
};
/**
 * Successful result of getAccount action
 */
export type GetAccountSuccess = {
    /**
     * - Address of the account
     */
    address: Address;
    /**
     * - Account nonce
     */
    nonce: bigint;
    /**
     * - Account balance in wei
     */
    balance: bigint;
    /**
     * - Contract bytecode (empty for EOA)
     */
    deployedBytecode: Hex;
    /**
     * - Storage root hash
     */
    storageRoot: Hex;
    /**
     * - Code hash
     */
    codeHash: Hex;
    /**
     * - True if account has code
     */
    isContract: boolean;
    /**
     * - True if account is empty (no balance, nonce, code)
     */
    isEmpty: boolean;
    /**
     * - Contract storage (if returnStorage=true)
     */
    storage?: Record<Hex, Hex>;
};
/**
 * Parameters for setAccount action
 */
export type SetAccountParams = {
    /**
     * - Address of the account to modify
     */
    address: Address;
    /**
     * - Account nonce to set
     */
    nonce?: bigint;
    /**
     * - Account balance to set in wei
     */
    balance?: bigint;
    /**
     * - Contract bytecode to deploy
     */
    deployedBytecode?: Hex;
    /**
     * - Storage root hash to set (32 bytes)
     */
    storageRoot?: Hex;
    /**
     * - Clear storage first, then set these slots
     */
    state?: Record<Hex, Hex>;
    /**
     * - Patch existing storage without clearing
     */
    stateDiff?: Record<Hex, Hex>;
};
/**
 * Successful result of setAccount action
 */
export type SetAccountSuccess = {
    /**
     * - Address of the modified account
     */
    address: Address;
};
/**
 * Parameters for getBalance action (eth_getBalance)
 */
export type GetBalanceParams = {
    /**
     * - Address to query balance for
     */
    address: Address;
    /**
     * - Block tag to fetch balance from
     */
    blockTag?: BlockParam;
};
/**
 * Parameters for getCode action (eth_getCode)
 */
export type GetCodeParams = {
    /**
     * - Address to query code for
     */
    address: Address;
    /**
     * - Block tag to fetch code from
     */
    blockTag?: BlockParam;
};
/**
 * Parameters for getStorageAt action (eth_getStorageAt)
 */
export type GetStorageAtParams = {
    /**
     * - Address of the contract
     */
    address: Address;
    /**
     * - Storage slot position (can be any hex, will be padded to 32 bytes)
     */
    position: Hex;
    /**
     * - Block tag to fetch storage from
     */
    blockTag?: BlockParam;
};
//# sourceMappingURL=types.d.ts.map