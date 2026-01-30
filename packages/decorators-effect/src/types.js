/**
 * @module @tevm/decorators-effect/types
 * Type definitions for Effect-based decorators
 */

/**
 * Hex string type for Ethereum addresses, hashes, and data
 * @typedef {`0x${string}`} Hex
 */

/**
 * Ethereum address type (20 bytes hex)
 * @typedef {`0x${string}`} Address
 */

/**
 * Block parameter for state queries
 * @typedef {'latest' | 'earliest' | 'pending' | 'safe' | 'finalized' | Hex | bigint} BlockParam
 */

/**
 * Parameters for eth_call
 * @typedef {Object} EthCallParams
 * @property {Address} to - Target contract address
 * @property {Address} [from] - Sender address
 * @property {Hex} [data] - Call data
 * @property {bigint} [gas] - Gas limit
 * @property {bigint} [gasPrice] - Gas price
 * @property {bigint} [value] - Value to send
 * @property {BlockParam} [blockTag] - Block tag for state
 */

/**
 * Parameters for eth_getBalance
 * @typedef {Object} EthGetBalanceParams
 * @property {Address} address - Account address
 * @property {BlockParam} [blockTag] - Block tag for state
 */

/**
 * Parameters for eth_getCode
 * @typedef {Object} EthGetCodeParams
 * @property {Address} address - Contract address
 * @property {BlockParam} [blockTag] - Block tag for state
 */

/**
 * Parameters for eth_getStorageAt
 * @typedef {Object} EthGetStorageAtParams
 * @property {Address} address - Contract address
 * @property {Hex} position - Storage slot position
 * @property {BlockParam} [blockTag] - Block tag for state
 */

/**
 * Shape of the EthActions service
 * @typedef {Object} EthActionsShape
 * @property {() => import('effect').Effect<bigint, import('@tevm/errors-effect').InternalError, never>} blockNumber - Get current block number
 * @property {(params: EthCallParams) => import('effect').Effect<Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} call - Execute eth_call
 * @property {() => import('effect').Effect<bigint, never, never>} chainId - Get chain ID
 * @property {() => import('effect').Effect<bigint, never, never>} gasPrice - Get current gas price (returns fixed 1 gwei for in-memory simulation)
 * @property {(params: EthGetBalanceParams) => import('effect').Effect<bigint, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} getBalance - Get account balance
 * @property {(params: EthGetCodeParams) => import('effect').Effect<Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} getCode - Get contract code
 * @property {(params: EthGetStorageAtParams) => import('effect').Effect<Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} getStorageAt - Get storage value
 */

/**
 * Parameters for TEVM call action
 * @typedef {Object} TevmCallParams
 * @property {Address} [to] - Target address
 * @property {Address} [from] - Sender address
 * @property {Hex} [data] - Call data
 * @property {bigint} [gas] - Gas limit
 * @property {bigint} [gasPrice] - Gas price
 * @property {bigint} [value] - Value to send
 * @property {bigint} [depth] - Call depth
 * @property {boolean} [createTransaction] - Create transaction
 * @property {boolean} [skipBalance] - Skip balance check
 */

/**
 * Result of TEVM call action
 * @typedef {Object} TevmCallResult
 * @property {Hex} rawData - Raw return data
 * @property {bigint} executionGasUsed - Gas used in execution
 * @property {bigint} [gas] - Remaining gas
 * @property {Hex} [createdAddress] - Created contract address
 * @property {string} [exceptionError] - Error message if failed
 */

/**
 * Parameters for TEVM getAccount action
 * @typedef {Object} TevmGetAccountParams
 * @property {Address} address - Account address
 * @property {BlockParam} [blockTag] - Block tag for state
 * @property {boolean} [returnStorage] - Return storage slots
 */

/**
 * Result of TEVM getAccount action
 * @typedef {Object} TevmGetAccountResult
 * @property {Address} address - Account address
 * @property {bigint} nonce - Account nonce
 * @property {bigint} balance - Account balance
 * @property {Hex} deployedBytecode - Deployed bytecode
 * @property {Hex} storageRoot - Storage root hash
 * @property {Hex} codeHash - Code hash
 * @property {boolean} isContract - Is contract account
 * @property {boolean} isEmpty - Is empty account
 * @property {Record<Hex, Hex>} [storage] - Storage slots
 */

/**
 * Parameters for TEVM setAccount action
 * @typedef {Object} TevmSetAccountParams
 * @property {Address} address - Account address
 * @property {bigint} [nonce] - Account nonce
 * @property {bigint} [balance] - Account balance
 * @property {Hex} [deployedBytecode] - Deployed bytecode
 * @property {Record<Hex, Hex>} [state] - Storage state
 */

/**
 * Result of TEVM setAccount action
 * @typedef {Object} TevmSetAccountResult
 * @property {Address} address - Account address
 */

/**
 * Shape of the TevmActions service
 * @typedef {Object} TevmActionsShape
 * @property {(params: TevmCallParams) => import('effect').Effect<TevmCallResult, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} call - Execute TEVM call
 * @property {(params: TevmGetAccountParams) => import('effect').Effect<TevmGetAccountResult, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} getAccount - Get account state
 * @property {(params: TevmSetAccountParams) => import('effect').Effect<TevmSetAccountResult, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} setAccount - Set account state
 * @property {() => import('effect').Effect<string, import('@tevm/errors-effect').InternalError, never>} dumpState - Dump VM state
 * @property {(state: string) => import('effect').Effect<void, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} loadState - Load VM state
 * @property {(options?: { blocks?: number }) => import('effect').Effect<void, import('@tevm/errors-effect').InternalError, never>} mine - Mine blocks
 */

/**
 * EIP-1193 request parameters
 * @typedef {Object} Eip1193RequestParams
 * @property {string} method - JSON-RPC method name
 * @property {Array<unknown>} [params] - Method parameters
 */

/**
 * Shape of the Request service for EIP-1193
 * @typedef {Object} RequestServiceShape
 * @property {<T = unknown>(params: Eip1193RequestParams) => import('effect').Effect<T, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError, never>} request - Execute EIP-1193 request
 */

/**
 * JSON-RPC request
 * @typedef {Object} JsonRpcRequest
 * @property {string} jsonrpc - JSON-RPC version
 * @property {string} method - Method name
 * @property {Array<unknown>} [params] - Parameters
 * @property {number | string} id - Request ID
 */

/**
 * JSON-RPC response
 * @typedef {Object} JsonRpcResponse
 * @property {string} jsonrpc - JSON-RPC version
 * @property {unknown} [result] - Result
 * @property {{code: number, message: string}} [error] - Error
 * @property {number | string} id - Request ID
 */

/**
 * Shape of the Send service for JSON-RPC
 *
 * Note: Both `send` and `sendBulk` have `never` in the error channel because
 * all errors are caught and converted to JSON-RPC error responses. The Effect
 * always succeeds - errors are encoded in the response's `error` field per JSON-RPC 2.0 spec.
 *
 * @typedef {Object} SendServiceShape
 * @property {<T = unknown>(request: JsonRpcRequest) => import('effect').Effect<JsonRpcResponse, never, never>} send - Send single request (errors returned in response.error)
 * @property {(requests: Array<JsonRpcRequest>) => import('effect').Effect<Array<JsonRpcResponse>, never, never>} sendBulk - Send bulk requests (errors returned in response.error)
 */

export {}
