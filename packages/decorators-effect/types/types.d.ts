/**
 * Hex string type for Ethereum addresses, hashes, and data
 */
export type Hex = `0x${string}`;
/**
 * Ethereum address type (20 bytes hex)
 */
export type Address = `0x${string}`;
/**
 * Block parameter for state queries
 */
export type BlockParam = "latest" | "earliest" | "pending" | "safe" | "finalized" | Hex | bigint;
/**
 * Parameters for eth_call
 */
export type EthCallParams = {
    /**
     * - Target contract address
     */
    to: Address;
    /**
     * - Sender address
     */
    from?: Address;
    /**
     * - Call data
     */
    data?: Hex;
    /**
     * - Gas limit
     */
    gas?: bigint;
    /**
     * - Gas price
     */
    gasPrice?: bigint;
    /**
     * - Value to send
     */
    value?: bigint;
    /**
     * - Block tag for state
     */
    blockTag?: BlockParam;
};
/**
 * Parameters for eth_getBalance
 */
export type EthGetBalanceParams = {
    /**
     * - Account address
     */
    address: Address;
    /**
     * - Block tag for state
     */
    blockTag?: BlockParam;
};
/**
 * Parameters for eth_getCode
 */
export type EthGetCodeParams = {
    /**
     * - Contract address
     */
    address: Address;
    /**
     * - Block tag for state
     */
    blockTag?: BlockParam;
};
/**
 * Parameters for eth_getStorageAt
 */
export type EthGetStorageAtParams = {
    /**
     * - Contract address
     */
    address: Address;
    /**
     * - Storage slot position
     */
    position: Hex;
    /**
     * - Block tag for state
     */
    blockTag?: BlockParam;
};
/**
 * Shape of the EthActions service
 */
export type EthActionsShape = {
    /**
     * - Get current block number
     */
    blockNumber: () => typeof import("effect/Effect");
    /**
     * - Execute eth_call
     */
    call: (params: EthCallParams) => typeof import("effect/Effect");
    /**
     * - Get chain ID
     */
    chainId: () => typeof import("effect/Effect");
    /**
     * - Get current gas price (returns fixed 1 gwei for in-memory simulation)
     */
    gasPrice: () => typeof import("effect/Effect");
    /**
     * - Get account balance
     */
    getBalance: (params: EthGetBalanceParams) => typeof import("effect/Effect");
    /**
     * - Get contract code
     */
    getCode: (params: EthGetCodeParams) => typeof import("effect/Effect");
    /**
     * - Get storage value
     */
    getStorageAt: (params: EthGetStorageAtParams) => typeof import("effect/Effect");
};
/**
 * Parameters for TEVM call action
 */
export type TevmCallParams = {
    /**
     * - Target address
     */
    to?: Address;
    /**
     * - Sender address
     */
    from?: Address;
    /**
     * - Call data
     */
    data?: Hex;
    /**
     * - Gas limit
     */
    gas?: bigint;
    /**
     * - Gas price
     */
    gasPrice?: bigint;
    /**
     * - Value to send
     */
    value?: bigint;
    /**
     * - Call depth
     */
    depth?: bigint;
    /**
     * - Create transaction
     */
    createTransaction?: boolean;
    /**
     * - Skip balance check
     */
    skipBalance?: boolean;
};
/**
 * Result of TEVM call action
 */
export type TevmCallResult = {
    /**
     * - Raw return data
     */
    rawData: Hex;
    /**
     * - Gas used in execution
     */
    executionGasUsed: bigint;
    /**
     * - Remaining gas
     */
    gas?: bigint;
    /**
     * - Created contract address
     */
    createdAddress?: Hex;
    /**
     * - Error message if failed
     */
    exceptionError?: string;
};
/**
 * Parameters for TEVM getAccount action
 */
export type TevmGetAccountParams = {
    /**
     * - Account address
     */
    address: Address;
    /**
     * - Block tag for state
     */
    blockTag?: BlockParam;
    /**
     * - Return storage slots
     */
    returnStorage?: boolean;
};
/**
 * Result of TEVM getAccount action
 */
export type TevmGetAccountResult = {
    /**
     * - Account address
     */
    address: Address;
    /**
     * - Account nonce
     */
    nonce: bigint;
    /**
     * - Account balance
     */
    balance: bigint;
    /**
     * - Deployed bytecode
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
     * - Is contract account
     */
    isContract: boolean;
    /**
     * - Is empty account
     */
    isEmpty: boolean;
    /**
     * - Storage slots
     */
    storage?: Record<Hex, Hex>;
};
/**
 * Parameters for TEVM setAccount action
 */
export type TevmSetAccountParams = {
    /**
     * - Account address
     */
    address: Address;
    /**
     * - Account nonce
     */
    nonce?: bigint;
    /**
     * - Account balance
     */
    balance?: bigint;
    /**
     * - Deployed bytecode
     */
    deployedBytecode?: Hex;
    /**
     * - Storage state
     */
    state?: Record<Hex, Hex>;
};
/**
 * Result of TEVM setAccount action
 */
export type TevmSetAccountResult = {
    /**
     * - Account address
     */
    address: Address;
};
/**
 * Shape of the TevmActions service
 */
export type TevmActionsShape = {
    /**
     * - Execute TEVM call
     */
    call: (params: TevmCallParams) => typeof import("effect/Effect");
    /**
     * - Get account state
     */
    getAccount: (params: TevmGetAccountParams) => typeof import("effect/Effect");
    /**
     * - Set account state
     */
    setAccount: (params: TevmSetAccountParams) => typeof import("effect/Effect");
    /**
     * - Dump VM state
     */
    dumpState: () => typeof import("effect/Effect");
    /**
     * - Load VM state
     */
    loadState: (state: string) => typeof import("effect/Effect");
    /**
     * - Mine blocks
     */
    mine: (options?: {
        blocks?: number;
    }) => typeof import("effect/Effect");
};
/**
 * EIP-1193 request parameters
 */
export type Eip1193RequestParams = {
    /**
     * - JSON-RPC method name
     */
    method: string;
    /**
     * - Method parameters
     */
    params?: Array<unknown>;
};
/**
 * Shape of the Request service for EIP-1193
 */
export type RequestServiceShape = {
    /**
     * - Execute EIP-1193 request
     */
    request: <T = unknown>(params: Eip1193RequestParams) => typeof import("effect/Effect");
};
/**
 * JSON-RPC request
 */
export type JsonRpcRequest = {
    /**
     * - JSON-RPC version
     */
    jsonrpc: string;
    /**
     * - Method name
     */
    method: string;
    /**
     * - Parameters
     */
    params?: Array<unknown>;
    /**
     * - Request ID
     */
    id: number | string;
};
/**
 * JSON-RPC response
 */
export type JsonRpcResponse = {
    /**
     * - JSON-RPC version
     */
    jsonrpc: string;
    /**
     * - Result
     */
    result?: unknown;
    /**
     * - Error
     */
    error?: {
        code: number;
        message: string;
    };
    /**
     * - Request ID
     */
    id: number | string;
};
/**
 * Shape of the Send service for JSON-RPC
 *
 * Note: Both `send` and `sendBulk` have `never` in the error channel because
 * all errors are caught and converted to JSON-RPC error responses. The Effect
 * always succeeds - errors are encoded in the response's `error` field per JSON-RPC 2.0 spec.
 */
export type SendServiceShape = {
    /**
     * - Send single request (errors returned in response.error)
     */
    send: <T = unknown>(request: JsonRpcRequest) => typeof import("effect/Effect");
    /**
     * - Send bulk requests (errors returned in response.error)
     */
    sendBulk: (requests: Array<JsonRpcRequest>) => typeof import("effect/Effect");
};
//# sourceMappingURL=types.d.ts.map