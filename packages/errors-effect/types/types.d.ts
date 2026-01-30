/**
 * Union type for all EVM execution errors
 */
export type EvmExecutionError = import("./evm/InsufficientBalanceError.js").InsufficientBalanceError | import("./evm/InsufficientFundsError.js").InsufficientFundsError | import("./evm/InvalidJumpError.js").InvalidJumpError | import("./evm/OutOfGasError.js").OutOfGasError | import("./evm/RevertError.js").RevertError | import("./evm/InvalidOpcodeError.js").InvalidOpcodeError | import("./evm/StackOverflowError.js").StackOverflowError | import("./evm/StackUnderflowError.js").StackUnderflowError;
/**
 * Union type for all JSON-RPC errors
 */
export type JsonRpcError = import("./jsonrpc/InvalidRequestError.js").InvalidRequestError | import("./jsonrpc/MethodNotFoundError.js").MethodNotFoundError | import("./jsonrpc/InvalidParamsError.js").InvalidParamsError | import("./jsonrpc/InternalError.js").InternalError;
/**
 * Union type for all node errors
 */
export type NodeError = import("./node/SnapshotNotFoundError.js").SnapshotNotFoundError | import("./node/FilterNotFoundError.js").FilterNotFoundError | import("./node/NodeNotReadyError.js").NodeNotReadyError;
/**
 * Union type for all transport errors
 */
export type TransportError = import("./transport/ForkError.js").ForkError | import("./transport/NetworkError.js").NetworkError | import("./transport/TimeoutError.js").TimeoutError;
/**
 * Union type for all state errors
 */
export type StateError = import("./state/StateRootNotFoundError.js").StateRootNotFoundError | import("./state/AccountNotFoundError.js").AccountNotFoundError | import("./state/StorageError.js").StorageError;
/**
 * Union type for all transaction errors
 */
export type TransactionError = import("./transaction/InvalidTransactionError.js").InvalidTransactionError | import("./transaction/NonceTooLowError.js").NonceTooLowError | import("./transaction/NonceTooHighError.js").NonceTooHighError | import("./transaction/GasTooLowError.js").GasTooLowError;
/**
 * Union type for all block errors
 */
export type BlockError = import("./block/BlockNotFoundError.js").BlockNotFoundError | import("./block/InvalidBlockError.js").InvalidBlockError | import("./block/BlockGasLimitExceededError.js").BlockGasLimitExceededError;
/**
 * Union type for all TEVM errors
 */
export type TevmErrorUnion = import("./TevmError.js").TevmError | EvmExecutionError | JsonRpcError | NodeError | TransportError | StateError | TransactionError | BlockError;
//# sourceMappingURL=types.d.ts.map